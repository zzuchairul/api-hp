import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: 'example@company.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0821.....', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Jl. Petarani, Makassar, Indonesia',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
