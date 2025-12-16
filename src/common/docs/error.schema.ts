import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const BadRequestExample = ApiBadRequestResponse({
  description: 'Invalid input data',
  schema: {
    example: {
      message: ['Error message goes here', 'Error message goes here'],
      error: 'Bad Request',
      statusCode: 400,
    },
  },
});

export const UnauthorizedExample = ApiUnauthorizedResponse({
  description: 'No user login',
  schema: {
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
    },
  },
});

export const ForbiddenExample = ApiForbiddenResponse({
  description: 'Forbidden to access resources',
  schema: {
    example: {
      message: 'Error message goes here',
      error: 'Forbidden',
      statusCode: 403,
    },
  },
});

export const ConflictExample = ApiConflictResponse({
  description: 'entitites already exist',
  schema: {
    example: {
      statusCode: 409,
      error: 'Conflict',
      message: 'Error message goes here',
    },
  },
});
