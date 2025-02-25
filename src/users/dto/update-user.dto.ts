import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'Email must be a string.' })
  @IsEmail()
  @IsString({ message: 'Email must be a string.' })
  email: string;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false.' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  password?: string;
}
