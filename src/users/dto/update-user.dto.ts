import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'User name must be a string.' })
  userName?: string;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false.' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  password?: string;
}
