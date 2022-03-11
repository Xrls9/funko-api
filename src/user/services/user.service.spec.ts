import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import faker from 'faker';
import { NotFound, UnprocessableEntity } from 'http-errors';
import { AuthController } from 'src/auth/controllers/auth.controller';
import { TokenFactory } from 'src/auth/factories/token.factory';
import { AuthService } from 'src/auth/services/auth.service';
import { clearDatabase, prisma } from 'src/prisma';
import { UserController } from '../controllers/user.controller';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserFactory } from '../factories/user.factory';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let users: User[];

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
      providers: [UserService, AuthService],
    }).compile();

    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
    userFactory = new UserFactory(prisma);
    tokenFactory = new TokenFactory(prisma);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should throw an error if the user already exists', async () => {
      const username = faker.internet.userName();
      await userFactory.make({ username });
      const data = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username,
        password: faker.internet.password(6),
        verified: false,
      });

      await expect(userService.create(data)).rejects.toThrowError(
        new UnprocessableEntity('username already taken'),
      );
    });

    it('should create a new user', async () => {
      const spyCreateToken = jest.spyOn(authService, 'createToken');
      // const spySendEmail = jest.spyOn(SendgridService, 'sendEmail');
      const generateAccessToken = jest.spyOn(
        authService,
        'generateAccessToken',
      );
      const data = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
        verified: false,
      });

      const result = await userService.create(data);

      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      // expect(spySendEmail).toHaveBeenCalledTimes(1);
      expect(generateAccessToken).toHaveBeenCalledTimes(1);
      expect(result).toBeTruthy();
    });
  });

  describe('findOne', () => {
    let user: User;

    beforeAll(async () => {
      user = await userFactory.make();
    });

    it('should throw an error if the user does not exist', async () => {
      await expect(
        userService.findOne(faker.datatype.uuid()),
      ).rejects.toThrowError(new NotFound('No User found'));
    });

    it('should return the user', async () => {
      const result = await userService.findOne(user.uuid);

      expect(result).toHaveProperty('uuid', user.uuid);
    });
  });

  describe('getUuidFromToken', () => {
    it('should return a user uuid from token', async () => {
      const user = await userFactory.make({});

      const token = await AuthService.createToken(user.uuid);

      const result = await userService.getUuidFromToken(token.jti);

      expect(result).toEqual(user.uuid);
    });
  });

  describe('update', () => {
    beforeAll(() => {
      jest.mock('jsonwebtoken', () => ({
        sign: jest.fn().mockImplementation(() => 'my.jwt.token'),
      }));
    });

    it('should throw an error if the user does not exist', async () => {
      const data = plainToClass(UpdateUserDto, {});

      await expect(
        userService.update(faker.datatype.uuid(), data),
      ).rejects.toThrowError(new NotFound('User not found'));
    });

    it('should throw an error if the user tries to update the email with non unique email', async () => {
      const existingEmail = faker.internet.email();
      const [user] = await Promise.all([
        userFactory.make(),
        userFactory.make({ email: existingEmail }),
      ]);

      const data = plainToClass(UpdateUserDto, { email: existingEmail });

      await expect(userService.update(user.uuid, data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      );
    });

    it('should update the user', async () => {
      const user = await userFactory.make();
      const newEmail = faker.internet.email();
      const dto = plainToClass(UpdateUserDto, { email: newEmail });

      const result = await userService.update(user.uuid, dto);

      expect(result).toHaveProperty('email', newEmail);
    });
  });
});
