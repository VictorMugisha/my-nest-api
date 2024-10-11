import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/schemas/user.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Get('all')
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('user/:id')
  getSingleUser(@Param('id') id: string) {
    return this.userService.getSingleUser(id);
  }

  @Get('me')
  getMyDetails(@Req() req: Request): Promise<User> {
    return this.userService.getMyDetails(req);
  }
}
