import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

export const gqlGetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;

    return request.user;
  },
);
