import { Process, Processor } from '@nestjs/bull';
import { type Job } from 'bull';

@Processor('applications')
export class ApplicationProcessor {
  @Process('processApplication')
  async handleApplication(job: Job) {
    console.log('Processing application ID:', job.data.applicationId);
    console.log('Notifying job poster ID:', job.data.jobPosterId);
  }
}
