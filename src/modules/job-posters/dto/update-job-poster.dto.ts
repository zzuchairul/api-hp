import { PartialType } from '@nestjs/swagger';
import { CreateJobPosterDto } from './create-job-poster.dto';

export class UpdateJobPosterDto extends PartialType(CreateJobPosterDto) {}
