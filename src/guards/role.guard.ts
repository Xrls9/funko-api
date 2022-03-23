import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../decorators/role.decorator';
import { prisma } from '../prisma';
import { UserRole } from '../utils/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const contextUser = await prisma.user.findUnique({
      where: { uuid: user.uuid },
    });

    return requiredRoles.some((role) => contextUser.role?.includes(role));
  }
}
