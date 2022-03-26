import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { prisma } from '../../prisma';
import { NotFound } from 'http-errors';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { allowedValidMimeTypes, PrismaErrorEnum } from '../../utils/enums';
import { FunkoDto } from '../dtos/res/funko.dto';
import { UpdateFunkoDto } from '../dtos/req/update-funko.dto';
import { PaginationDto } from '../dtos/res/pagination.dto';
import { FilesService } from '../../services/file.service';
import { CreateFunkoReactionDto } from '../dtos/req/create-funko-reaction.dto';
import { FunkoReactionDto } from '../dtos/res/funko-reaction.dto';
import { UpdateFunkoReactionDto } from '../dtos/req/update-funko-reaction.dto';

@Injectable()
export class FunkoService {
  constructor(private filesService: FilesService) {}

  async find(
    page: number,
    pageItems: number,
    category: string,
  ): Promise<PaginationDto> {
    const skip = (page - 1) * pageItems;
    const take = pageItems;
    const funkos = await prisma.funko.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: {
        category: { contains: category },
        active: true,
      },
    });

    for (const funko of funkos) {
      const key = funko.image;
      if (key) {
        funko.image = await this.getFile(key);
      }
    }

    return {
      results: plainToInstance(FunkoDto, funkos),
      paginationInfo: { skip, take: funkos.length },
    };
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

    return plainToInstance(FunkoDto, {
      ...funko,
      image: await this.getFile(funko.image),
    });
  }

  async uploadFile(uuid: string, fileType: string): Promise<string> {
    const extension = allowedValidMimeTypes[fileType];
    if (!extension) throw new ConflictException('File type not allowed');

    await this.update(uuid, { image: `${uuid}.${extension}` });
    return await this.filesService.uploadPublicFile(uuid, extension);
  }

  async getFile(key: string): Promise<string> {
    return await this.filesService.generatePresignedUrl(key);
  }

  async setReaction(input: CreateFunkoReactionDto): Promise<FunkoReactionDto> {
    const exists = await prisma.funkoReaction.findMany({
      where: { userId: input.userId, funkoId: input.funkoId },
    });

    if (exists.length !== 0)
      throw new ConflictException('Reaction has been setted up');

    const reaction = await prisma.funkoReaction.create({
      data: { ...input },
    });
    return plainToInstance(FunkoReactionDto, reaction);
  }

  async updateReaction(
    funkoUuid: string,
    input: UpdateFunkoReactionDto,
  ): Promise<FunkoReactionDto> {
    const exists = await prisma.funkoReaction.findMany({
      where: { userId: input.userId, funkoId: funkoUuid },
    });
    if (exists.length === 0) throw new NotFound('No funko reaction found');

    const reaction = await prisma.funkoReaction.update({
      data: { ...input },
      where: { uuid: exists[0].uuid },
    });

    return plainToInstance(FunkoReactionDto, reaction);
  }

  async showReaction(
    funkoUuid: string,
    userUuid: string,
  ): Promise<FunkoReactionDto> {
    const reaction = await prisma.funkoReaction.findMany({
      where: { funkoId: funkoUuid, userId: userUuid },
    });

    if (reaction.length === 0) throw new NotFound('No funko reaction found');

    return plainToInstance(FunkoReactionDto, reaction[0]);
  }
}
