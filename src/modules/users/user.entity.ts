import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../applications/application.entity';
import { Company } from '../companies/company.entity';
import { JobPoster } from '../job-posters/job-poster.entity';

export enum UserRole {
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Company, (company) => company.creator)
  companies: Company;

  @OneToMany(() => JobPoster, (jobPoster) => jobPoster.company)
  jobPosters: JobPoster[];

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}
