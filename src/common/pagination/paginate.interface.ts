export interface PaginateOptions {
  page?: number;
  limit?: number;
}

export class PaginationInput<T> {
  searchBy?: string;
  searchVal?: string;
  orderBy: string;
  orderVal: 'ASC' | 'DESC' | 'asc' | 'desc';
  page?: number;
  limit?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Indicates if there is a next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Indicates if there is a previous page' })
  hasPrev: boolean;
}

export class PaginateResult<T> {
  @ApiProperty({ description: 'Paginated data', type: Object })
  data: T;

  @ApiProperty({
    description: 'Pagination metadata',
    type: () => PaginationMetaDto,
  })
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
