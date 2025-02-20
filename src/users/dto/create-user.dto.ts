import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false.' })
  receivedNotifications?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false.' })
  receivedEmails?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false.' })
  receivedSMS?: boolean;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'User name is required.' })
  @IsString({ message: 'User name must be a string.' })
  userName: string;

  @IsNotEmpty({ message: 'Active status is required.' })
  @IsBoolean({ message: 'Active status must be true or false.' })
  isActive: boolean;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  password: string;
}
