import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { name, username, password, confirmPassword } = signupDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new BadRequestException('User already exist');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new this.userModel({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    return userToReturn;
  }

  async login(loginDto: LoginDto, @Res() res: Response) {
    const { username, password } = loginDto;
    if (!username || !password) {
      throw new BadRequestException('All field are required');
    }

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return res.status(200).json(user);
  }
}
