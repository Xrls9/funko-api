import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '../../decorators/set-public.decorator';
import { GqlJwtGuard } from '../../guards/gql-jwt-auth.guard';
import { LoginInput } from '../models/inputs/login.input';

import { TokenModel } from '../models/token.model';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => TokenModel)
  async logIn(@Args('data') loginDto: LoginInput): Promise<TokenModel> {
    return this.authService.login(loginDto);
  }

  // @UseGuards(GqlJwtGuard)
  // @Mutation(() => String)
  // async logOut(@Args('authorization') accessToken: string): Promise<any> {
  //   const result = this.authService.logout(accessToken);
  //   return result ? { result: 'logged out' } : { result: 'something failed' };
  // }
}
