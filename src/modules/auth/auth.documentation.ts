// src/modules/auth/auth.documentation.ts
import {
  BadRequestExample,
  ConflictExample,
  UnauthorizedExample,
} from '@/common/docs/error.schema';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';

export const ApiRegisterUserResponses = () =>
  applyDecorators(
    ApiCreatedResponse({
      description: 'User successfully registered',
      type: PublicUserDto,
    }),
    BadRequestExample,
    ConflictExample,
  );

export const ApiLoginUserResponses = () =>
  applyDecorators(
    ApiOkResponse({
      description: 'Login successful',
      type: LoginResponseDTO,
    }),
    BadRequestExample,
    UnauthorizedExample,
  );
