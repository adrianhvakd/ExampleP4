import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @MinLength(4)
  password?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}
