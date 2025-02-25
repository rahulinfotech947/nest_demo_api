import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/Schema/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isEmailInUse = await this.userModel.findOne({ email });
    if (isEmailInUse) {
      throw new BadRequestException('Email already in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      email,
      password: hashPassword,
    });
    return newUser.save();
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const isUserExist = await this.userModel.findOne({ email });
    if (!isUserExist) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(password, isUserExist.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }
    const token = 'erdtfyguhijok;,';
    return { token };
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      {
        new: true,
      },
    );
    if (!data) {
      throw new BadRequestException({ message: 'User not found' });
    }
    return data;
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
