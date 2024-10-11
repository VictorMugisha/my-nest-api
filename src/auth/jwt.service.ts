import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string): string {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
