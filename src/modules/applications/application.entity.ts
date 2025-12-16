import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPoster } from '../job-posters/job-poster.entity';
import { User } from '../users/user.entity';

export enum StatusApplication {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobPoster, (jobPoster) => jobPoster.applications, {
    onDelete: 'CASCADE',
  })
  jobPoster: JobPoster;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  candidate: User;

  @Column({ nullable: true })
  cvFilePath?: string;

  @Column({
    type: 'enum',
    enum: StatusApplication,
    default: StatusApplication.PENDING,
  })
  status: StatusApplication;

  @CreateDateColumn()
  created_at: Date;
}
