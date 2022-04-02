import { ConflictException, Injectable } from '@nestjs/common';
import { prisma } from '../../prisma';
import { UnprocessableEntity } from 'http-errors';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { hashSync } from 'bcrypt';
import { NotFound } from 'http-errors';
import { AuthService } from '../../auth/services/auth.service';
import { UserDto } from '../dtos/response/user.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { PrismaErrorEnum } from '../../utils/enums';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { SendgridService } from '../../services/sengrid.service';
import { PasswordRecoveryDto } from '../dtos/request/password-recovery.dto';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private sendgridService: SendgridService,
  ) {}

  async create(input: CreateUserDto): Promise<UserDto> {
    const userFound = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new UnprocessableEntity('email already taken');
    }

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashSync(input.password, 10),
      },
    });

    const token = await this.authService.createToken(user.uuid);
    const accessToken = this.authService.generateAccessToken(token.jti);

    return plainToInstance(UserDto, user);
  }

  async findOne(uuid: string): Promise<UserDto> {
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    return plainToInstance(UserDto, user);
  }

  async getIdFromToken(jti: string): Promise<string> {
    const token = await prisma.token.findUnique({ where: { jti } });

    return token.userId;
  }

  async update(uuid: string, { ...input }: UpdateUserDto): Promise<UserDto> {
    try {
      const user = await prisma.user.update({
        data: {
          ...input,
        },
        where: {
          uuid,
        },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFound('User not found');
          case PrismaErrorEnum.DUPLICATED:
            throw new UnprocessableEntity('email already taken');
        }
      }

      throw new ConflictException(error);
    }
  }

  async changePassword(
    uuid: string,
    { ...input }: PasswordRecoveryDto,
  ): Promise<UserDto> {
    try {
      const user = await prisma.user.update({
        data: {
          password: hashSync(input.password, 10),
        },
        where: {
          uuid,
        },
      });
      this.sendgridService.sendEmail(
        user.email,
        `<h1> Your password has been changed succesfully <h1>`,
        'Password Change',
      );
      return plainToInstance(UserDto, user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('User not found');
        }
      }

      throw error;
    }
  }
}
