import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { StatusApplication } from '../application.entity';

export class ValidateApplicationDto {
  @ApiProperty({ description: 'JobPoster ID the candidate is applying to' })
  @IsIn([StatusApplication.ACCEPTED, StatusApplication.REJECTED])
  status: StatusApplication;
}
