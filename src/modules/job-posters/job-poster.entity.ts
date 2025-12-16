import { Company } from '@/modules/companies/company.entity';
import { User } from '@/modules/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../applications/application.entity';

@Entity('job-posters')
export class JobPoster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  role: string;

  @Column()
  description: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.jobPosters)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.jobPosters)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Application, (application) => application.jobPoster)
  applications: Application[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
