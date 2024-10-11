import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization) {
      console.log('No authorization found in request!');
      return false;
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.log('Token verification failed: ', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
