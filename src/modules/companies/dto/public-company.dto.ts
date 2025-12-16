import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CreatorPublicDto {
  @Expose()
  @ApiProperty({ description: 'Creator unique identifier' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Creator name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Creator email', required: false })
  email?: string;
}

export class PublicCompanyDto {
  @Expose()
  @ApiProperty({ description: 'Company unique identifier' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Company name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Company email', required: false })
  email?: string;

  @Expose()
  @ApiProperty({ description: 'Company phone number', required: false })
  phone?: string;

  @Expose()
  @ApiProperty({ description: 'Company address', required: false })
  address?: string;

  @Expose()
  @Type(() => CreatorPublicDto)
  @ApiProperty({
    description: 'Company creator information',
    type: () => CreatorPublicDto,
    required: false,
  })
  creator: CreatorPublicDto;
}
