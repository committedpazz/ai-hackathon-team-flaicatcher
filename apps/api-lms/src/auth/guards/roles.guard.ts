import type { AuthenticatedUser, Role } from "@cerios/shared-types";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>();
        const hasRole = requiredRoles.some(role => request.user.roles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException("You do not have permission to perform this action.");
        }

        return true;
    }
}
