// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decodedToken;

      return requiredRoles.some((role) => request.user.roles?.includes(role));
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
