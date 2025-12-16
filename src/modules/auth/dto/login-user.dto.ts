import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({
    name: 'email',
    example: 'fauzan@demo.com',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'secretpass',
    description: 'User password',
    minLength: 8,
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
