import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../utils/enums';

export const ROLES = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES, roles);
