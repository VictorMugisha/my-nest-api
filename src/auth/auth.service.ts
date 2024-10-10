import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return 'This is signup from service';
  }

  login() {
    return 'This is login from service';
  }
}
