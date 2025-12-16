import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiLoginUserResponses,
  ApiRegisterUserResponses,
} from './auth.documentation';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @ApiOperation({
    summary: 'Register User',
    description:
      'Create a new user in the system using the provided information.',
  })
  @ApiBody({
    type: RegisterUserDTO,
    description: 'Payload for creating a new user',
  })
  @ApiRegisterUserResponses()
  @Post('/register')
  register(@Body() dto: RegisterUserDTO) {
    return this.AuthService.registerUser(dto);
  }

  @ApiOperation({
    summary: 'Login User',
    description: 'Login user in the system with JWT.',
  })
  @ApiBody({
    type: LoginUserDTO,
    description: 'User credential',
  })
  @ApiLoginUserResponses()
  @Post('/login')
  login(@Body() dto: LoginUserDTO) {
    return this.AuthService.loginUser(dto);
  }
}
