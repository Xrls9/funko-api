import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const { role } = await prisma.user.findUnique({
      where: {
        ...user,
      },
    });

    return role === 'Manager';
  }
}
