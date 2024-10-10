import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('In middleware we are logging.....');
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = { _id: decoded.id };
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
