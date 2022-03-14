import { CartItem, Prisma, PrismaClient } from '@prisma/client';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type cartItemInput = Partial<Prisma.CartItemCreateInput>;

export class CartItemFactory extends AbstractFactory<CartItem> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: cartItemInput): Promise<CartItem> {
    return this.prismaClient.cartItem.create({
      data: {
        ...input,
        quantity: input.quantity || 1,
        totalPrice: input.totalPrice || 0,
      },
    });
  }
  async makeMany(factorial: number, input: cartItemInput): Promise<CartItem[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
