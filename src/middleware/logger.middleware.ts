import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    console.log('In middleware we are logging.....');
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        message: 'No authorization header',
      });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({
        message: 'No token provided',
      });
    }

    req.user = { _id: '' };
    next();
  }
}
