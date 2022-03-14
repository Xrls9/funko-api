import { Prisma, PrismaClient, User, UserRole } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { AbstractFactory } from '../../utils/factories/abstract.factory';
import { internet, name } from 'faker';

type UserInput = Partial<Prisma.UserCreateInput>;

export class UserFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaClient: PrismaClient) {
    super();
  }
  async make(input: UserInput = {}): Promise<User> {
    return this.prismaClient.user.create({
      data: {
        ...input,
        role: input.role ?? UserRole.client,
        verified: input.verified ?? false,
        firstName: input.firstName ?? name.firstName(),
        email: input.email ?? internet.email(),
        username: input.username ?? internet.userName(),
        lastName: input.lastName ?? name.lastName(),
        password: hashSync(input.password ?? internet.password(), 10),
      },
    });
  }
  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
