import { Funko, User } from '@prisma/client';
import { clearDatabase, prisma } from '../../prisma';
import { FunkoFactory } from '../../funkos/factories/funko.factory';
import { UserFactory } from '../../user/factories/user.factory';
import { CartController } from '../controllers/cart.controller';
import { UpdateCartItemDto } from '../dtos/carts/request/update-cart-item.dto';
import { CreateCartDto } from '../dtos/carts/request/create-cart.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { datatype, internet } from 'faker';
import { CartService } from './cart.service';
import { UpdateCartDto } from '../dtos/carts/request/update-cart.dto';
import { CartDto } from '../dtos/carts/response/cart.dto';
import { plainToInstance } from 'class-transformer';
import { NotFound } from 'http-errors';
import { CartItemDto } from '../dtos/carts/response/cart-item.dto';
import { CartFactory } from '../factories/cart.factory';
import { CreateCartItemDto } from '../dtos/carts/request/create-cart-item.dto';
import { CartItemFactory } from '../factories/cart-item.factory';

describe('CartService', () => {
  let cartService: CartService;
  let userFactory: UserFactory;
  let funkoFactory: FunkoFactory;
  let cartFactory: CartFactory;
  let cartItemFactory: CartItemFactory;

  let newUser: User;
  let newFunko: Funko;

  let updateCartDto: UpdateCartDto;
  let cart: CartDto;
  // let cartItem: CartItemDto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [CartService],
    }).compile();

    cartService = app.get<CartService>(CartService);
    userFactory = new UserFactory(prisma);
    funkoFactory = new FunkoFactory(prisma);
    cartItemFactory = new CartItemFactory(prisma);

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
      const result = await cartService.create(newUser.uuid);
      expect(result).toHaveProperty('createdAt');
    });

    it('should throw an arror if user does not exists', async () => {
      const result = await cartService.create(internet.uuid);
      expect(result).rejects.toThrow(new NotFound('User not found'));
    });
  });

  describe('update', () => {
    beforeAll(async () => {
      cart = await cartService.create(newUser.uuid);
    });

    it('should throw an error if the cart does not exists', async () => {
      await expect(
        cartService.update(datatype.uuid(), updateCartDto),
      ).rejects.toThrowError(new NotFound('Cart not found'));
    });

    it('should update the cart values', async () => {
      const result = await cartService.update(cart.uuid, updateCartDto);

      expect(result).toHaveProperty('totalPrice', 30.0);
    });
  });

  describe('CartItem Functions', async () => {
    const cart = await cartFactory.make({
      user: { connect: { uuid: newUser.uuid } },
    });
    const cartItem = plainToInstance(CreateCartItemDto, {
      funkoId: newFunko.uuid,
      quantity: 1,
    });

    const item = await cartItemFactory.make({
      quantity: 1,
      funko: { connect: { uuid: newFunko.uuid } },
      cart: { connect: { uuid: cart.uuid } },
    });

    const updateCartItem = plainToInstance(UpdateCartItemDto, { quantity: 2 });

    describe('addItemToCart', async () => {
      it('should add an item to the cart', async () => {
        const result = await cartService.addItemToCart(cart.uuid, cartItem);
        expect(result).toHaveProperty('totalPrice');
      });
    });

    describe('updateCartItem', async () => {
      it('should throw an error if the cart-item does not exist', async () => {
        const result = await cartService.updateCartItem(
          datatype.uuid,
          updateCartItem,
        );
        expect(result).rejects.toThrow(new NotFound('Cart item not found'));
      });
      it('should update the cart-item values', async () => {
        const result = await cartService.updateCartItem(
          item.uuid,
          updateCartItem,
        );
        expect(result).toHaveProperty('quantity', 2);
      });
    });

    describe('showCartDetails', () => {
      it('should return an array containing a list of cartItems', async () => {
        const items = await cartService.getCartItems(newCart.uuid);
        expect(items.length).toBeGreaterThanOrEqual(0);
      });
    });

    describe('deleteCartItem', () => {
      it('should throw an error if the cart-0item does not exist', async () => {
        const result = await cartService.deleteCartItem(datatype.uuid);
        expect(result).toThrow(new NotFound('Cart item not found'));
      });

      it('should delete the cart-item', async () => {
        const result = await cartService.deleteCartItem(item.uuid);
        expect(result).toHaveProperty('quantity');
      });
    });
  });
});
