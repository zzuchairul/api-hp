import {
  BadRequestExample,
  ForbiddenExample,
  UnauthorizedExample,
} from '@/common/docs/error.schema';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';

export const ApiJobRecomendationsResponse = () =>
  applyDecorators(
    ApiCreatedResponse({
      description: 'Response successfully registered',
    }),
    BadRequestExample,
    UnauthorizedExample,
    ForbiddenExample,
  );
