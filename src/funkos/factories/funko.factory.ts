import { Funko, Prisma, PrismaClient } from '@prisma/client';
import { commerce, datatype } from 'faker';
import { AbstractFactory } from '../../utils/factories/abstract.factory';

type funkoInput = Partial<Prisma.FunkoCreateInput>;

export class FunkoFactory extends AbstractFactory<Funko> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: funkoInput): Promise<Funko> {
    return this.prismaClient.funko.create({
      data: {
        ...input,
        name: input.name ?? commerce.productName(),
        price: input.price ?? datatype.number(),
        active: input.active ?? true,
        category: input.category ?? 'default',
        stock: input.stock ?? datatype.number({ max: 100 }),
      },
    });
  }
  async makeMany(factorial: number, input: funkoInput): Promise<Funko[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
