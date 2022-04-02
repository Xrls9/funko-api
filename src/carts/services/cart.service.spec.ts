import { Funko, User } from '@prisma/client';
import { clearDatabase, prisma } from '../../prisma';
import { FunkoFactory } from '../../funkos/factories/funko.factory';
import { UserFactory } from '../../user/factories/user.factory';
import { CartController } from '../controllers/cart.controller';
import { UpdateCartItemDto } from '../dtos/carts/request/update-cart-item.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { datatype, internet } from 'faker';
import { CartService } from './cart.service';
import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { plainToInstance } from 'class-transformer';
import { NotFound } from 'http-errors';
import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';
import { FunkoService } from '../../funkos/services/funko.service';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FilesService } from '../../services/file.service';
import { ConflictException } from '@nestjs/common';
import { OrderItem } from '../dtos/orders/response/order-item.dto';

describe('CartService', () => {
  let cartService: CartService;
  let userFactory: UserFactory;
  let funkoFactory: FunkoFactory;
  let testCart: CartDto;
  let cartItemDto: CartItemDto;

  let newUser: User;
  let newFunko: Funko;

  let updateCartDto: UpdateCartDto;
  let createCartItemDto: CreateCartItemDto;
  let updateCartItemDto: UpdateCartItemDto;

  // let cartItem: CartItemDto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        FunkoService,
        EventEmitter2,
        ConfigService,
        FilesService,
      ],
    }).compile();

    cartService = app.get<CartService>(CartService);
    userFactory = new UserFactory(prisma);
    funkoFactory = new FunkoFactory(prisma);

    updateCartDto = plainToInstance(UpdateCartDto, {
      totalPrice: 30.0,
    });

    newUser = await userFactory.make({
      username: internet.userName(),
      password: internet.password(),
    });

    newFunko = await funkoFactory.make({
      user: { connect: { uuid: newUser.uuid } },
      name: 'Iron Man',
      category: 'default',
      stock: 10,
      price: 50.0,
    });

    testCart = await cartService.createCart(newUser.uuid);

    createCartItemDto = { funkoId: newFunko.uuid, quantity: 1 };
    updateCartItemDto = { quantity: 2 };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create a new cart', async () => {
      const result = await cartService.createCart(newUser.uuid);

      expect(result).toHaveProperty('createdAt');
    });
  });

  describe('update', () => {
    it('should throw an error if the cart does not exists', async () => {
      await expect(
        cartService.updateCart(datatype.uuid(), updateCartDto),
      ).rejects.toThrowError(new NotFound('Cart not found'));
    });

    it('should update the cart values', async () => {
      const result = await cartService.updateCart(testCart.uuid, updateCartDto);

      expect(result).toHaveProperty('totalPrice', 30.0);
    });
  });

  describe('addItemToCart', () => {
    it('should add an item to the cart', async () => {
      cartItemDto = await cartService.addItemToCart(
        testCart.uuid,
        createCartItemDto,
      );

      expect(cartItemDto).toHaveProperty('totalPrice');
    });
  });

  describe('showCartDetails', () => {
    it('should return an array containing a list of cartItems', async () => {
      const items = await cartService.getCartItems(testCart.uuid);
      expect(items.length).toBeGreaterThanOrEqual(0);
    });
    it('should return [] either if cart does not exist or cart is empty', async () => {
      const items = await cartService.getCartItems(datatype.uuid());
      expect(items).toEqual([]);
    });
  });

  describe('updateCartItem', () => {
    it('should throw an error if the cart-item does not exist', async () => {
      await expect(
        cartService.updateCartItem(datatype.uuid(), updateCartItemDto),
      ).rejects.toThrow(new NotFound('No CartItem found'));
    });

    it('should throw an error if the quantity is bigger than stock', async () => {
      await expect(
        cartService.updateCartItem(cartItemDto.uuid, {
          quantity: 100,
        }),
      ).rejects.toThrowError(new Error('The funko Iron Man is not available'));
    });
    it('should update the cart-item values', async () => {
      const result = await cartService.updateCartItem(cartItemDto.uuid, {
        quantity: 2,
      });
      expect(result).toHaveProperty('quantity', 2);
    });
  });

  describe('deleteCartItem', () => {
    it('should throw an error if the cart-item does not exist', async () => {
      await expect(
        cartService.deleteCartItem(datatype.uuid()),
      ).rejects.toThrowError(new NotFound('CartItem not found'));
    });

    it('should delete the cart-item', async () => {
      const result = await cartService.deleteCartItem(cartItemDto.uuid);
      expect(result).toHaveProperty('quantity');
    });
  });

  describe('checkout', () => {
    it('should throw an error if cart is empty', async () => {
      await expect(cartService.checkout(testCart.uuid)).rejects.toThrowError(
        new ConflictException('Cart is Empty'),
      );
    });

    it('should return an order response, containing info', async () => {
      await cartService.addItemToCart(testCart.uuid, createCartItemDto);
      const result = await cartService.checkout(testCart.uuid);
      expect(result).toHaveProperty('orderInfo');
      expect(result).toHaveProperty('orderDetails');
      expect(result).toHaveProperty('count');
      expect(result.orderInfo.totalPrice).toBe(50);
    });
  });

  describe('clearCart', () => {
    it('should throw an error if the cart does not exist', async () => {
      await expect(cartService.clearCart(datatype.uuid())).rejects.toThrowError(
        new NotFound('Cart not found'),
      );
    });

    it('should clear cart', async () => {
      const result = await cartService.clearCart(testCart.uuid);
      expect(result).toHaveProperty('totalPrice', 0);
    });
  });

  describe('addItemsToOrder', () => {
    it('should return the number of cart items registered to the order', async () => {
      await cartService.addItemToCart(testCart.uuid, createCartItemDto);
      const newOrder = await prisma.order.create({
        data: {
          userId: testCart.userId,
          totalPrice: testCart.totalPrice,
        },
      });
      const result = await cartService.addItemsToOrder(
        newOrder.uuid,
        plainToInstance(
          OrderItem,
          await prisma.cartItem.findMany({ where: { cartId: testCart.uuid } }),
        ),
      );
      expect(result).toBe(1);
    });
  });
});
