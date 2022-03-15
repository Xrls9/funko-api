import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaErrorEnum } from '../../utils/enums';
import { NotFound } from 'http-errors';
import { prisma } from '../../prisma';
import { CreateCartDto } from '../dtos/carts/request/create-cart.dto';
import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';
import { FunkoService } from '../../funkos/services/funko.service';
import { UpdateCartItemDto } from '../dtos/carts/request/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private funkoService: FunkoService) {}

  async createCart(userUuid: string): Promise<CartDto> {
    const cart = await prisma.cart.create({
      data: {
        userId: userUuid,
      },
    });

    return plainToInstance(CartDto, cart);
  }

  async updateCart(
    cartUuid: string,
    { ...input }: UpdateCartDto,
  ): Promise<CartDto> {
    try {
      const cart = await prisma.cart.update({
        data: {
          ...input,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('Cart not found');
        }
      }
      throw error;
    }
  }

  async addItemToCart(
    cartUuid: string,
    { ...input }: CreateCartItemDto,
  ): Promise<CartItemDto> {
    const funko = await this.funkoService.findOne(input.funkoId);
    const cart = await this.findCartByUuid(cartUuid);
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.uuid,
        ...input,
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
    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    );
    return total;
  }

  async checkStock(cartItemUuid: string, quantity: number): Promise<void> {
    const item = await prisma.cartItem.findUnique({
      where: {
        uuid: cartItemUuid,
      },
    });

    const funko = await this.funkoService.findOne(item.funkoId);

    if (quantity > funko.stock) {
      throw new Error('This product does not have enough stock');
    }
  }

  async clearCart(cartUuid: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { cartId: cartUuid } });
    await this.calculateTotal(cartUuid);
  }

  async updateCartItem(
    cartItemUuid: string,
    { ...input }: UpdateCartItemDto,
  ): Promise<CartItemDto> {
    await this.checkStock(cartItemUuid, input.quantity);
    const item = await prisma.cartItem.update({
      data: {
        ...input,
      },
      where: {
        uuid: cartItemUuid,
      },
    });
    await this.updateCartTotal(item.cartId);

    return plainToInstance(CartItemDto, item);
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
}
