import { Injectable } from '@nestjs/common';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { prisma } from '../../prisma';
import { UnprocessableEntity } from 'http-errors';
import { NotFound } from 'http-errors';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { PrismaErrorEnum } from '../../utils/enums';

@Injectable()
export class FunkoService {
  async create(userUuid: string, dto: CreateFunkoDto) {
    await prisma.funko.create({ userUuid: userUuid, ...dto });
  }
}
