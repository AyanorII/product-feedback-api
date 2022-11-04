import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
