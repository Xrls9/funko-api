import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { internet, name, datatype } from 'faker';
import { NotFound, UnprocessableEntity } from 'http-errors';
import { AuthService } from '../../auth/services/auth.service';
import { clearDatabase, prisma } from '../../prisma';
import { SendgridService } from '../../services/sengrid.service';
import { UserController } from '../controllers/user.controller';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserFactory } from '../factories/user.factory';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, AuthService, SendgridService],
    }).compile();

    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
    userFactory = new UserFactory(prisma);
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
      const email = internet.email();
      await userFactory.make({ email });
      const data = plainToClass(CreateUserDto, {
        firstName: name.firstName(),
        lastName: name.lastName(),
        email,
        password: internet.password(6),
        verified: false,
      });

      await expect(userService.create(data)).rejects.toThrowError(
        new UnprocessableEntity('email already taken'),
      );
    });

    it('should create a new user', async () => {
      const spyCreateToken = jest.spyOn(authService, 'createToken');
      const generateAccessToken = jest.spyOn(
        authService,
        'generateAccessToken',
      );
      const data = plainToClass(CreateUserDto, {
        firstName: name.firstName(),
        lastName: name.lastName(),
        email: internet.email(),
        username: internet.userName(),
        password: internet.password(6),
        verified: false,
      });

      const result = await userService.create(data);

      expect(spyCreateToken).toHaveBeenCalledTimes(1);
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
      await expect(userService.findOne(datatype.uuid())).rejects.toThrowError(
        new NotFound('No User found'),
      );
    });

    it('should return the user', async () => {
      const result = await userService.findOne(user.uuid);

      expect(result).toHaveProperty('uuid', user.uuid);
    });
  });

  describe('getIdFromToken', () => {
    it('should return a user id from token', async () => {
      const user = await userFactory.make({});

      const token = await authService.createToken(user.uuid);

      const result = await userService.getIdFromToken(token.jti);

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
        userService.update(datatype.uuid(), data),
      ).rejects.toThrowError(new NotFound('User not found'));
    });

    it('should throw an error if the user tries to update the email with non unique email', async () => {
      const existingEmail = internet.email();
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
      const newEmail = internet.email();
      const dto = plainToClass(UpdateUserDto, { email: newEmail });

      const result = await userService.update(user.uuid, dto);

      expect(result).toHaveProperty('email', newEmail);
    });
  });
});
