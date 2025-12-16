import {
  BadRequestExample,
  ForbiddenExample,
  UnauthorizedExample,
} from '@/common/docs/error.schema';
import { PaginateResult } from '@/common/pagination/paginate.interface';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PublicCompanyDto } from './dto/public-company.dto';

export const ApiCreateCompanyResponse = () =>
  applyDecorators(
    ApiCreatedResponse({
      description: 'Company successfully registered',
      type: PublicCompanyDto,
    }),
    BadRequestExample,
    UnauthorizedExample,
    ForbiddenExample,
  );

export const ApiListResponse = () =>
  applyDecorators(
    ApiOkResponse({
      description: 'Successfully find companies list',
      type: PaginateResult<PublicCompanyDto[]>,
    }),
    UnauthorizedExample,
    BadRequestExample,
  );

export const ApiFindOneResponse = () =>
  applyDecorators(
    ApiOkResponse({
      description: 'Successfully find company',
    }),
    UnauthorizedExample,
    ForbiddenExample,
    BadRequestExample,
  );
