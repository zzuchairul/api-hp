import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { Company } from '../company.entity';

type OrderableColumns = keyof Omit<Company, 'id' | 'creator' | 'creatorId'>;

export class FindCompaniesDto {
  @ApiProperty({ required: false, description: 'Column to search' })
  @IsOptional()
  @IsString()
  searchBy?: OrderableColumns;

  @ApiProperty({ required: false, description: 'Value to search' })
  @IsOptional()
  @IsString()
  searchVal?: string;

  @ApiProperty({
    required: false,
    default: 'created_at',
    description: 'Column to order',
  })
  @IsOptional()
  @IsString()
  orderBy?: OrderableColumns = 'created_at';

  @ApiProperty({
    required: false,
    default: 'DESC',
    enum: ['ASC', 'DESC', 'asc', 'desc'],
    description: 'Column direction',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  orderVal: 'ASC' | 'DESC' | 'asc' | 'desc' = 'DESC';

  @ApiProperty({ required: false, default: 1, description: 'Current page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Size data per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
