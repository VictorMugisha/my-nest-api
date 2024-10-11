import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { id: string; role: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
