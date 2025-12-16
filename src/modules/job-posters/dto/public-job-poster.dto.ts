import {
  CreatorPublicDto,
  PublicCompanyDto,
} from '@/modules/companies/dto/public-company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PublicJobPosterDto {
  @Expose()
  @ApiProperty({ description: 'unique identifier' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'title of job poster' })
  title: string;

  @Expose()
  @ApiProperty({ description: 'role/position', required: false })
  role?: string;

  @Expose()
  @ApiProperty({ description: 'Desccription jobdesk', required: false })
  description?: string;

  @Expose()
  @Type(() => CreatorPublicDto)
  @ApiProperty({
    description: 'Job poster creator',
    type: () => CreatorPublicDto,
    required: false,
  })
  user?: CreatorPublicDto;

  @Expose()
  @Type(() => PublicCompanyDto)
  @ApiProperty({
    description: 'Company/placement',
    type: () => PublicCompanyDto,
    required: false,
  })
  company?: PublicCompanyDto;
}
