import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dtos/response/user.dto';

export const getUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
