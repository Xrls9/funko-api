import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dtos/response/user.dto';

export const getUser = createParamDecorator(
  (_data, context: ExecutionContext): UserDto => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
