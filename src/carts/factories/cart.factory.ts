import { Cart, Prisma, PrismaClient } from '@prisma/client';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type cartInput = Partial<Prisma.CartCreateInput>;

export class CartFactory extends AbstractFactory<Cart> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: cartInput): Promise<Cart> {
    return this.prismaClient.cart.create({
      data: {
        ...input,
        totalPrice: input.totalPrice || 0,
      },
    });
  }
  async makeMany(factorial: number, input: cartInput): Promise<Cart[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
