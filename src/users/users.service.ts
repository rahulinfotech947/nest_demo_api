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
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private common: CommonService,
  ) {}

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
    const access_token = await this.common.generateToken({
      email,
      userId: isUserExist._id,
      ROLE: 'ADMIN',
    });
    return { access_token, user: isUserExist };
  }

  async logout(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const isUserExist = await this.userModel.findOne({ email });
    if (!isUserExist) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(password, isUserExist.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }
    const access_token = await this.common.generateToken({
      email,
      userId: isUserExist._id,
      ROLE: 'ADMIN',
    });
    return { access_token, user: isUserExist };
  }

  findAll(query: any) {
    const obj = {};
    Object.keys(query).forEach((key) => {
      if (query[key] === 'true') obj[key] = true;
      else if (query[key] === 'false') obj[key] = false;
      else if (!isNaN(query[key])) obj[key] = Number(query[key]);
      else {
        obj[key] = { $regex: new RegExp(query[key], 'i') };
      }
    });
    return this.userModel.aggregate([
      { $match: obj },
      { $sort: { createdAt: -1 } },
      // { $group: { _id: '$_id', isActive: { $count: '$isActive' } } },
      { $unset: ['password'] }, // to remove one key
    ]);
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
