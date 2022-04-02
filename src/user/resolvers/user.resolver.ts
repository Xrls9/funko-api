import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from '../../decorators/set-public.decorator';
import { GqlJwtGuard } from '../../guards/gql-jwt-auth.guard';
import { gqlGetUser } from '../decorators/gql-get-user.decorator';
import { CreateUserInput } from '../models/inputs/create-user.input';
import { UpdateUserInput } from '../models/inputs/update-user.input';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => UserModel, { description: 'Creates a new User' })
  async createUser(
    @Args('input') userDto: CreateUserInput,
  ): Promise<UserModel> {
    return await this.userService.create(userDto);
  }

  @Public()
  @UseGuards(GqlJwtGuard)
  @Query(() => UserModel, { description: "Gets user's profile" })
  async findUser(@Args('userUuid') userUuid: string): Promise<UserModel> {
    return await this.userService.findOne(userUuid);
  }

  @Mutation(() => UserModel, { description: 'Update user info' })
  @UseGuards(GqlJwtGuard)
  async updateUser(
    @Args('userUuid') userUuid: string,
    @Args('input') updateUserDto: UpdateUserInput,
  ): Promise<UserModel> {
    return await this.userService.update(userUuid, updateUserDto);
  }
}
