import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prisma } from '../../prisma';
import { LoginDto } from '../../auth/dtos/request/login.dto';
import { TokenDto } from '../../auth/dtos/response/token.dto';
import { Unauthorized } from 'http-errors';
import { Prisma, Token } from '@prisma/client';
import { PrismaErrorEnum } from '../../utils/enums';
import { sign, verify } from 'jsonwebtoken';
import { NotFound } from 'http-errors';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { email, password } = loginDto;

    const user = await prisma.user.findUnique({
      where: { email: email },
      rejectOnNotFound: false,
    });

    if (!user) {
      throw new Unauthorized('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Unauthorized('Invalid credentials');
    }

    const token = await this.createToken(user.id);
    const tokenGenerated = this.generateAccessToken(token.jti);
    return tokenGenerated;
  }

  async logout(accessToken?: string): Promise<boolean> {
    if (!accessToken) return false;

    try {
      const { sub } = verify(accessToken, process.env.JWT_SECRET_KEY as string);

      await prisma.token.delete({ where: { jti: sub as string } });
      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async createToken(id: number): Promise<Token> {
    try {
      const token = await prisma.token.create({
        data: {
          userId: id,
        },
      });

      return token;
    } catch (error) {
      let throwable = error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throwable = new NotFound('User not found');
        }
      }

      throw throwable;
    }
  }
  generateAccessToken(sub: string): TokenDto {
    const now = new Date().getTime();
    const exp = Math.floor(
      new Date(now).setSeconds(
        parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
      ) / 1000,
    );
    const iat = Math.floor(now / 1000);

    const accessToken = sign(
      {
        sub,
        iat,
        exp,
      },
      process.env.JWT_SECRET_KEY as string,
    );

    return {
      accessToken,
      exp,
    };
  }
}
