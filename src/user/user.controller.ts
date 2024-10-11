import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('user/:id')
  getSingleUser(@Param('id') id: string) {
    return this.userService.getSingleUser(id);
  }
}
