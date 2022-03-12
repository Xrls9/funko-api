import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private sendgridService: SendgridService,
  ) {}

  async create(input: CreateUserDto) {
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

    const token = await this.authService.createToken(user.id);
    const accessToken = this.authService.generateAccessToken(token.jti);

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
    uuid: string,
    { password, ...input }: UpdateUserDto,
  ): Promise<UserDto> {
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

      throw error;
    }
  }
}
