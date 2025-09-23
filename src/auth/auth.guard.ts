import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './auth.public';
import { Reflector } from '@nestjs/core';

// Define the JWT payload interface
interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
  // Add other properties that your JWT contains
  [key: string]: any;
}

// Extend the Express Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstants.secret,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch (error: unknown) {
      // Safe error handling
      if (error instanceof Error) {
        throw new UnauthorizedException(`Invalid token: ${error.message}`);
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
