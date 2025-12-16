import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ description: 'JobPoster ID the candidate is applying to' })
  @IsUUID()
  jobPosterId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CV file',
    required: false,
  })
  @IsOptional()
  cvFile?: any;
}
