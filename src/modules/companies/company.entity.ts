// src/modules/companies/company.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobPoster } from '../job-posters/job-poster.entity';
import { User } from '../users/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @Column()
  address?: string;

  @Column({ type: 'uuid' })
  creatorId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(() => JobPoster, (jobPoster) => jobPoster.company)
  jobPosters: JobPoster[];
}
