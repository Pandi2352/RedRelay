import { SetMetadata } from '@nestjs/common';
import type { Role } from '../types';

export const ROLES_KEY = 'roles';

/**
 * Declares the roles allowed to access an endpoint.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
