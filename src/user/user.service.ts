import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAll(): Promise<User[]> {
    const users = this.userModel.find().select('-password');

    return users;
  }

  async getSingleUser(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format provided');
    }
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getMyDetails(req: Request): Promise<User> {
    const userId = req.user.id;
    if (!userId) {
      console.log("This is the id: ", req.user)
      throw new BadRequestException('You need to login first');
    }

    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user
    return null;
  }
}
