import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDetails: LoginUserDto) {
    return await this.usersService.login(loginDetails);
  }

  @Get()
  findAll(@Query('email') email?: string) {
    console.log('🚀 ~ UsersController ~ findAll ~ email:', email);
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: any) {
    if (!isValidObjectId(params.id))
      throw new BadRequestException({ message: 'Invalid id' });
    const user = await this.usersService
      .findOne(params.id)
      .populate('settings');
    return user ? user : new HttpException('User not found', 404);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({ message: 'Invalid id' });
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException({ message: 'Invalid id' });
    }
    const IsDeleted = await this.usersService.remove(id);
    return IsDeleted.deletedCount !== 0
      ? IsDeleted
      : new HttpException('User not found', 404);
  }
}
