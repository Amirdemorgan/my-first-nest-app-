// eslint-disable-next-line prettier/prettier
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/enum/role.enum';
import { ROLES_KEY } from 'src/common/decorators/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException('شما دسترسی لازم را ندارید');
    }

    return true;
  }
}
