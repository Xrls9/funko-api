import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaErrorEnum } from '../../utils/enums';
import { NotFound } from 'http-errors';
import { prisma } from '../../prisma';
import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';
import { FunkoService } from '../../funkos/services/funko.service';
import { UpdateCartItemDto } from '../dtos/carts/request/update-cart-item.dto';
import { Order } from '../dtos/orders/response/order.dto';
import { OrderResponse } from '../dtos/orders/response/order-response.dto';
import { OrderItem } from '../dtos/orders/response/order-item.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CartService {
  constructor(
    private funkoService: FunkoService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createCart(userUuid: string): Promise<CartDto> {
    const cart = await prisma.cart.create({
      data: {
        userId: userUuid,
      },
    });

    return plainToInstance(CartDto, cart);
  }

  async updateCart(cartUuid: string, input: UpdateCartDto): Promise<CartDto> {
    try {
      const cart = await prisma.cart.update({
        data: {
          totalPrice: input.totalPrice,
        },
        where: {
          uuid: cartUuid,
        },
      });

      return plainToInstance(CartDto, cart);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('Cart not found');
        }
      }
      throw error;
    }
  }
  async getCartItems(cartUuid: string): Promise<CartItemDto[]> {
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cartUuid },
    });
    return plainToInstance(CartItemDto, cartItems);
  }

  async findCartByUuid(cartUuid: string): Promise<CartDto> {
    try {
      const cart = await prisma.cart.findUnique({
        where: {
          uuid: cartUuid,
        },
      });

      return plainToInstance(CartDto, cart);
    } catch (error) {
      throw new NotFound('Cart not found');
    }
  }

  async addItemToCart(
    cartUuid: string,
    { ...input }: CreateCartItemDto,
  ): Promise<CartItemDto> {
    const funko = await this.funkoService.findOne(input.funkoId);
    const cart = await this.findCartByUuid(cartUuid);
    await this.checkStock(funko.uuid, input.quantity);
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.uuid,
        ...input,
        description: funko.name,
        unitPrice: funko.price,
        totalPrice: input.quantity * funko.price,
      },
    });
    await this.updateCartTotal(cartUuid);
    return plainToInstance(CartItemDto, cartItem);
  }

  async updateCartTotal(cartUuid: string): Promise<void> {
    const cart = await this.findCartByUuid(cartUuid);

    const dto: UpdateCartDto = {
      totalPrice: await this.calculateTotal(cart.uuid),
    };

    await this.updateCart(cart.uuid, dto);
  }

  async calculateTotal(cartUuid: string): Promise<number> {
    const items = await this.getCartItems(cartUuid);
    let total = 0;
    if (items.length !== 0) {
      total = items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0,
      );
    }

    return total;
  }

  async checkStock(funkoUuid: string, quantity: number): Promise<void> {
    const funko = await this.funkoService.findOne(funkoUuid);

    if (quantity > funko.stock)
      throw new ConflictException(`The funko ${funko.name} is not available`);
  }

  async clearCart(cartUuid: string): Promise<CartDto> {
    await prisma.cartItem.deleteMany({
      where: { cartId: cartUuid },
    });
    await this.updateCartTotal(cartUuid);
    return await this.findCartByUuid(cartUuid);
  }

  async updateCartItem(
    cartItemUuid: string,
    { ...input }: UpdateCartItemDto,
  ): Promise<CartItemDto> {
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        uuid: cartItemUuid,
      },
    });
    await this.checkStock(cartItem.funkoId, input.quantity);
    cartItem = await prisma.cartItem.update({
      data: {
        ...input,
      },
      where: {
        uuid: cartItemUuid,
      },
    });
    await this.updateCartTotal(cartItem.cartId);

    return plainToInstance(CartItemDto, cartItem);
  }

  async deleteCartItem(cartItemUuid: string): Promise<CartItemDto> {
    try {
      const item = await prisma.cartItem.delete({
        where: {
          uuid: cartItemUuid,
        },
      });
      await this.updateCartTotal(item.cartId);
      return plainToInstance(CartItemDto, item);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('CartItem not found');
        }
      }
      throw error;
    }
  }

  async checkout(cartUuid: string): Promise<OrderResponse> {
    try {
      const cart = await prisma.cart.findUnique({ where: { uuid: cartUuid } });
      const order = await prisma.order.create({
        data: {
          userId: cart.userId,
          totalPrice: cart.totalPrice,
        },
      });
      //TODO must await payment(order.totalPrice)
      const items = plainToInstance(
        OrderItem,
        await this.getCartItems(cart.uuid),
      );

      if (items.length === 0) throw new ConflictException('Cart is Empty');

      await this.clearCart(cart.uuid);

      const count = await this.addItemsToOrder(order.uuid, items);

      return {
        orderInfo: plainToInstance(Order, order),
        orderDetails: items,
        count: count,
      };
    } catch (error) {
      throw error;
    }
  }

  async addItemsToOrder(
    orderUuid: string,
    items: OrderItem[],
  ): Promise<number> {
    for (const item of items) {
      //NOTE: checkStock
      await this.checkStock(item.funkoId, item.quantity);

      //NOTE: updateStock
      const funko = await prisma.funko.update({
        where: { uuid: item.funkoId },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (funko.stock <= 3 && funko.stock > 0) {
        this.eventEmitter.emit('order.updated', funko);
      }

      item.orderId = orderUuid;
    }

    const orders = plainToInstance(OrderItem, items);

    const result = await prisma.orderItem.createMany({ data: orders });
    return result.count;
  }

  async showUserOrders(userUuid: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({ where: { userId: userUuid } });
    return plainToInstance(Order, orders);
  }
}
