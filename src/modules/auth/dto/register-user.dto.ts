import { UserRole } from '@/modules/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    name: 'name',
    example: 'Fauzan Adithya',
    required: true,
    description: 'User register name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'email',
    example: 'fauzan@demo.com',
    description: 'User register email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'secretpass',
    description: 'User register password',
    minLength: 8,
    required: true,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'User register role',
    enum: [UserRole.CANDIDATE, UserRole.RECRUITER],
    example: UserRole.CANDIDATE,
    default: UserRole.CANDIDATE,
  })
  @IsIn([UserRole.CANDIDATE, UserRole.RECRUITER], {
    message: 'Role must be either CANDIDATE or RECRUITER',
  })
  role: UserRole = UserRole.CANDIDATE;
}
