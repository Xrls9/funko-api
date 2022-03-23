import { Injectable } from '@nestjs/common';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { prisma } from '../../prisma';
import { NotFound } from 'http-errors';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { PrismaErrorEnum } from '../../utils/enums';
import { FunkoDto } from '../dtos/res/funko.dto';
import { UpdateFunkoDto } from '../dtos/req/update-funko.dto';
import { PaginationDto } from '../dtos/res/pagination.dto';

@Injectable()
export class FunkoService {
  async find(
    page: number,
    pageItems: number,
    category: string,
  ): Promise<PaginationDto> {
    const skip = (page - 1) * pageItems;
    const take = pageItems;
    const funkos = plainToInstance(
      FunkoDto,
      await prisma.funko.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        where: {
          category: { contains: category },
          active: true,
        },
      }),
    );

    return { results: funkos, paginationInfo: { skip, take: funkos.length } };
  }

  async create(uuid: string, { ...input }: CreateFunkoDto): Promise<FunkoDto> {
    const funko = await prisma.funko.create({
      data: {
        ...input,
        userId: uuid,
      },
    });

    return funko;
  }

  async update(
    funkoUuid: string,
    { ...input }: UpdateFunkoDto,
  ): Promise<FunkoDto> {
    try {
      const funko = await prisma.funko.update({
        data: {
          ...input,
        },
        where: {
          uuid: funkoUuid,
        },
      });

      return plainToInstance(FunkoDto, funko);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('Funko not found');
        }
      }
      throw error;
    }
  }

  async remove(funkoUuid: string): Promise<FunkoDto> {
    try {
      const funko = await prisma.funko.delete({
        where: {
          uuid: funkoUuid,
        },
      });

      return funko;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorEnum.NOT_FOUND) {
          throw new NotFound('Funko not found');
        }
      }
      throw error;
    }
  }

  async findOne(uuid: string): Promise<FunkoDto> {
    const funko = await prisma.funko.findUnique({ where: { uuid } });

    return plainToInstance(FunkoDto, funko);
  }
}
