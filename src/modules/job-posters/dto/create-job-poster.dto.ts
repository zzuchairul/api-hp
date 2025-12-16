import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateJobPosterDto {
  @ApiProperty({ example: 'Oprec 2026' })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  @Length(1, 255)
  role: string;

  @ApiProperty({ example: 'Jobdesk is: 1, 2, 3' })
  @IsString()
  @Length(1, 255)
  description: string;
}
