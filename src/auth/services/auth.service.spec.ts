import { plainToClass, plainToInstance } from 'class-transformer';
import { internet, datatype, lorem } from 'faker';
import { clearDatabase, prisma } from '../../prisma';
import { TokenFactory } from '../../auth/factories/token.factory';
import { UserFactory } from '../../user/factories/user.factory';
import { LoginDto } from '../dtos/request/login.dto';
import { AuthService } from './auth.service';
import { Unauthorized, NotFound } from 'http-errors';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';

describe('AuthService', () => {
  let authService: AuthService;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    userFactory = new UserFactory(prisma);
    tokenFactory = new TokenFactory(prisma);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('login', () => {
    let userPassword: string;
    let userEmail: string;

    beforeAll(() => {
      userPassword = internet.password(6);
      userEmail = internet.email();
    });

    it('should throw an error if the user does not exist', async () => {
      const data = plainToInstance(LoginDto, {
        email: internet.email(),
        password: internet.password(6),
      });

      await expect(authService.login(data)).rejects.toThrowError(
        new Unauthorized('Invalid credentials'),
      );
    });

    it('should throw an error if the user password was incorrect', async () => {
      await userFactory.make({ password: userPassword, email: userEmail });

      const data = plainToClass(LoginDto, {
        email: userEmail,
        password: internet.password(6),
      });

      await expect(authService.login(data)).rejects.toThrowError(
        new Unauthorized('Invalid credentials'),
      );
    });

    it('should create the token for the user', async () => {
      const data = plainToClass(LoginDto, {
        email: userEmail,
        password: userPassword,
      });

      const result = await authService.login(data);

      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('createToken', () => {
    it('should throw an error if the user does not exist', async () => {
      await expect(
        authService.createToken(datatype.uuid()),
      ).rejects.toThrowError(new NotFound('User not found'));
    });

    it('should create the token', async () => {
      const user = await userFactory.make();
      const result = await authService.createToken(user.uuid);

      expect(result).toHaveProperty('userId', user.uuid);
    });
  });

  describe('logout', () => {
    it('should return if the token was not provided', async () => {
      const result = await authService.logout();
      expect(result).toBeFalsy();
    });

    it('should throw an error if the token was invalid', async () => {
      const spyConsole = jest
        .spyOn(console, 'error')
        .mockImplementation(jest.fn());

      await authService.logout(lorem.word());

      expect(spyConsole).toBeCalledWith(new JsonWebTokenError('jwt malformed'));
    });

    it('should delete the token', async () => {
      const token = await tokenFactory.make({
        user: { connect: { id: (await userFactory.make()).id } },
      });

      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(jest.fn(() => ({ sub: token.jti })));

      const result = await authService.logout(lorem.word());

      expect(result).toBeTruthy();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a token', async () => {
      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn(() => '123.123.123'));

      const result = authService.generateAccessToken(lorem.word());

      expect(result).toHaveProperty('accessToken', '123.123.123');
    });
  });
});
