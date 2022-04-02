import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES } from '../decorators/role.decorator';
import { prisma } from '../prisma';
import { UserRole } from '../utils/enums';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const { req } = ctx.getContext();

    const contextUser = await prisma.user.findUnique({
      where: { uuid: req.user.uuid },
    });
    return requiredRoles.some((role) => contextUser.role?.includes(role));
  }
}
