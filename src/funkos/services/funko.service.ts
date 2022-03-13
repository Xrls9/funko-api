import { Injectable } from '@nestjs/common';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { prisma } from '../../prisma';
import { NotFound } from 'http-errors';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { PrismaErrorEnum } from '../../utils/enums';
import { FunkoDto } from '../dtos/res/funko.dto';
import { UpdateFunkoDto } from '../dtos/req/update-funko.dto';

@Injectable()
export class FunkoService {
  async find(page: number, pageItems: number): Promise<FunkoDto[]> {
    const funkos = await prisma.funko.findMany({
      skip: page * pageItems,
      take: pageItems,
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(FunkoDto, funkos);
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

  // async findPostReaction(
  //   postId: string,
  //   userId: string,
  // ): Promise<PostReaction[]> {
  //   const postReactionFound = await prisma.postReaction.findMany({
  //     where: {
  //       postId,
  //       userId,
  //     },
  //   });
  //   return postReactionFound;
  // }

  // async createReaction(
  //   userId: string,
  //   { ...input }: CreatePostReactionDto,
  // ): Promise<PostReactionCreatedDto> {
  //   const postReaction = await prisma.postReaction.create({
  //     data: {
  //       ...input,
  //       userId: userId,
  //     },
  //   });

  //   return postReaction;
  // }

  // async updateReaction(
  //   uuid: string,
  //   status: string,
  // ): Promise<PostReactionCreatedDto> {
  //   try {
  //     const postReactionUpdated = await prisma.postReaction.update({
  //       data: {
  //         status,
  //       },
  //       where: {
  //         uuid,
  //       },
  //     });

  //     return postReactionUpdated;
  //   } catch (error) {
  //     let throwable = error;
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       switch (error.code) {
  //         case :
  //           throwable = new NotFound('Post Reaction not found');
  //       }
  //     }
  //     throw throwable;
  //   }
  // }
}
