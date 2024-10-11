import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid token payload');
      }
      req.user = { _id: decoded.id };
      next();
    } catch (error) {
      console.log('Error in Auth Middleware: ', error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Could not authenticate user');
    }
  }
}
