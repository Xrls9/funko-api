import { Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';
import { UnprocessableEntity } from 'http-errors';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { hashSync } from 'bcrypt';
import { NotFound } from 'http-errors';
import { AuthService } from 'src/auth/services/auth.service';
import { UserDto } from '../dtos/response/user.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { PrismaErrorEnum } from 'src/utils/enums';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { SendgridService } from 'src/services/sengrid.service';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private sendgridService: SendgridService,
  ) {}

  async create({ password, ...input }: CreateUserDto) {
    const userFound = await prisma.user.findUnique({
      where: { username: input.username },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new UnprocessableEntity('username already taken');
    }

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashSync(password, 10),
      },
    });

    const token = await this.authService.createToken(user.id);
    const accessToken = this.authService.generateAccessToken(token.jti);
    await SendgridService.sendEmail(user.email, accessToken).catch((err) => {
      throw err;
    });

    return true;
  }

  async findOne(uuid: string): Promise<UserDto> {
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    return plainToInstance(UserDto, user);
  }

  async getIdFromToken(jti: string): Promise<number> {
    const token = await prisma.token.findUnique({ where: { jti } });

    return token.userId;
  }

  async update(
    id: number,
    { password, ...input }: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      const user = await prisma.user.update({
        data: {
          ...input,
        },
        where: {
          id,
        },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      let throwable = error;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throwable = new NotFound('User not found');
            break;
          case PrismaErrorEnum.DUPLICATED:
            throwable = new UnprocessableEntity('email already taken');
            break;
        }
      }

      throw throwable;
    }
  }
}
