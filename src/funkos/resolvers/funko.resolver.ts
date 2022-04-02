import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FunkoModel } from '../models/funko.model';
import { FunkoService } from '../services/funko.service';
import { Reactions, UserRole } from '../../utils/enums';
import { Public } from '../../decorators/set-public.decorator';
import { CreateFunkoInput } from '../models/inputs/create-funko.input';
import { UpdateFunkoInput } from '../models/inputs/upate-funko.input';
import { plainToInstance } from 'class-transformer';
import { getUser } from '../../user/decorators/get-user.decorator';
import { User } from '@prisma/client';
import {
  DefaultValuePipe,
  ParseEnumPipe,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FunkoReactionModel } from '../models/funko-reaction.model';
import { UserModel } from '../../user/models/user.model';
import { CreateFunkoReactionInput } from '../models/inputs/create-funko-reaction.input';
import { UpdateFunkoReactionInput } from '../models/inputs/update-funko-reaction.input';

import { GqlJwtGuard } from '../../guards/gql-jwt-auth.guard';
import { GqlRolesGuard } from '../../guards/gql-role.guard';
import { Roles } from '../../decorators/role.decorator';
import { PaginationModel } from '../models/pagination.model';
import { gqlGetUser } from '../../user/decorators/gql-get-user.decorator';
import { GetFunkosPaginatedInput } from '../models/inputs/get-funkos-paginated-input';

@Resolver()
export class FunkoResolver {
  constructor(private funkoService: FunkoService) {}

  @Mutation(() => FunkoModel, { description: 'Creates a new Funko' })
  async createFunko(
    @getUser() user: User,
    @Args('input') createFunkoInput: CreateFunkoInput,
  ): Promise<FunkoModel> {
    return await this.funkoService.create(user.uuid, createFunkoInput);
  }

  @Public()
  @Query(() => PaginationModel, {
    description: 'Gets a list of Funkos by category and paginated',
  })
  async getFunkos(
    @Args('input') getFunkosPaginatedInput: GetFunkosPaginatedInput,
  ): Promise<PaginationModel> {
    return this.funkoService.find(getFunkosPaginatedInput);
  }

  @Mutation(() => FunkoModel, { description: 'Updates an existing Funko' })
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  @Roles(UserRole.manager)
  async updateFunko(
    @Args('funkoUuid') funkoUuid: string,
    @Args('input') updateUserInput: UpdateFunkoInput,
  ): Promise<FunkoModel> {
    return await this.funkoService.update(funkoUuid, updateUserInput);
  }

  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  @Roles(UserRole.manager)
  @Mutation(() => FunkoModel, { description: 'Deletes an existing Funko' })
  async deleteFunko(@Args('funkoUuid') funkoUuid: string): Promise<FunkoModel> {
    return await this.funkoService.remove(funkoUuid);
  }

  @Query(() => FunkoModel, { description: 'Shows a funko information' })
  async showFunko(@Args('funkoUuid') funkoUuid: string): Promise<FunkoModel> {
    return await this.funkoService.findOne(funkoUuid);
  }

  //TODO change mimetype
  // @UseGuards(GqlJwtGuard, GqlRolesGuard)
  // @Roles(UserRole.manager)
  // @Mutation(() => String)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @Args('funkoUuid') funkoUuid: string,
  //   @UploadedFile('file') file,
  // ): Promise<string> {
  //   return this.funkoService.uploadFile(funkoUuid, file.mimetype);
  // }

  @Public()
  @Query(() => String)
  async getFile(@Args('funkoUuid') funkoUuid: string): Promise<string> {
    const funko = await this.funkoService.findOne(funkoUuid);
    return await this.funkoService.getFile(funko.image);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => FunkoReactionModel, {
    description: 'Sets a reaction to a funko made by an user',
  })
  async setReaction(
    @Args('funkoUuid') funkoUuid: string,
    @Args('reaction') reaction: Reactions,
    @gqlGetUser() user: UserModel,
  ): Promise<FunkoReactionModel> {
    const reactionDto = plainToInstance(CreateFunkoReactionInput, {
      userId: user.uuid,
      funkoId: funkoUuid,
      reaction: reaction,
    });

    return this.funkoService.setReaction(reactionDto);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => FunkoReactionModel, {
    description: 'Updates a reaction to a funko made by an user',
  })
  async updateReaction(
    @Args('funkoUuid') funkoUuid: string,
    @Args('reaction', new ParseEnumPipe(Reactions))
    reaction: Reactions,
    @getUser() user: UserModel,
  ): Promise<FunkoReactionModel> {
    const reactionDto = plainToInstance(UpdateFunkoReactionInput, {
      userId: user.uuid,
      reaction: reaction,
    });
    return await this.funkoService.updateReaction(funkoUuid, reactionDto);
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => FunkoReactionModel, {
    description: 'Shows a reaction to a funko made by an user',
  })
  async showReaction(
    @Args('funkoUuid') funkoUuid: string,
    @gqlGetUser() user: UserModel,
  ): Promise<FunkoReactionModel> {
    return await this.funkoService.showReaction(funkoUuid, user.uuid);
  }
}
