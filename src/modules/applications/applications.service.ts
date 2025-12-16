import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Queue } from 'bull';
import console from 'console';
import fs from 'fs/promises';
import path from 'path';
import { DataSource, Repository } from 'typeorm';
import { AuditAction } from '../audit/audit.entity';
import { AuditService } from '../audit/audit.service';
import { JobPosterRepository } from '../job-posters/job-posters.repository';
import { UsersRepository } from '../users/users.repository';
import { Application, StatusApplication } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ValidateApplicationDto } from './dto/validate-application.dto';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private usersRepository: UsersRepository,
    private jobsRepository: JobPosterRepository,
    @InjectQueue('applications') private applicationsQueue: Queue,
    private readonly auditService: AuditService,
    private dataSource: DataSource,
  ) {}

  async createApplication(
    dto: CreateApplicationDto,
    file: Express.Multer.File,
    userId: string,
    ip: string,
  ) {
    this.logger.log('info', {
      message: 'candidate applying',
      userId,
      dto,
    });

    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    const application = await this.applicationsRepository.findOne({
      where: {
        candidate: { id: userId },
        jobPoster: { id: dto.jobPosterId },
      },
    });

    if (application) {
      this.logger.log('warn', {
        message: 'failed applicataion, candidate already aplied to this job',
      });
      throw new ConflictException('You already applied to this job');
    }

    const [jobPoster, fullUser] = await Promise.all([
      this.jobsRepository.findOne({ where: { id: dto.jobPosterId } }),
      this.usersRepository.findOne({ where: { id: userId } }),
    ]);

    if (!jobPoster) {
      throw new BadRequestException(
        `jobPoster with ${dto.jobPosterId} not found`,
      );
    }

    if (!fullUser) {
      throw new NotFoundException('User not found');
    }

    const cvFilePath = await this.uploadCvFile(file, fullUser.id);

    const savedApplication = await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const dataApplication = {
          jobPoster,
          candidate: fullUser,
          cvFilePath,
          status: StatusApplication.PENDING,
        };

        const application = transactionalEntityManager.create(
          Application,
          dataApplication,
        );
        const saved = await transactionalEntityManager.save(application);

        await this.auditService.record({
          userId,
          entity: 'Application',
          entityId: saved.id,
          action: AuditAction.CREATE,
          oldValues: null,
          newValues: dataApplication,
          ipAddress: ip,
        });

        return saved;
      },
    );

    this.logger.log('info', {
      message: 'candidate successfully applied',
      userId,
      applicationId: savedApplication.id,
      status: savedApplication.status,
    });

    this.applicationsQueue.add('processApplication', {
      applicationId: savedApplication.id,
      jobPosterId: jobPoster.id,
    });

    return {
      message: 'Application created successfully',
      applicationId: savedApplication.id,
    };
  }

  private async uploadCvFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const uploadDir = path.join(__dirname, '../../../uploads');

    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    const ext = path.extname(file.originalname);
    const filename = `${userId}${ext}`;

    const uploadPath = path.join(uploadDir, filename);
    await fs.writeFile(uploadPath, file.buffer);
    return uploadPath;
  }

  async reviewApplication(
    applicationId: string,
    recruiterId: string,
    ip: string,
  ) {
    this.logger.log('info', {
      message: 'recruiter tried to review applciation',
      recruiterId,
      applicationId,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const application = await queryRunner.manager.findOne(Application, {
        where: { id: applicationId },
        relations: ['jobPoster'],
      });

      if (!application) {
        this.logger.log('warn', {
          message: 'reviewing failed, no application found',
          recruiterId,
          applicationId,
        });

        throw new NotFoundException('Application not found');
      }

      if (application.jobPoster.userId !== recruiterId) {
        this.logger.log('warn', {
          message:
            'reviewing failed,  recruiter tried to access another application',
          recruiterId,
          applicationId,
        });

        throw new ForbiddenException(
          'You can only review applications for your own jobs',
        );
      }

      if (application.status === StatusApplication.REVIEWED) {
        this.logger.log('warn', {
          message: 'skip reviewing, application already been reviewed',
          recruiterId,
          applicationId,
        });
        return {
          message: 'Application already reviewed',
          downloaded: false,
        };
      }

      let fileBuffer: Buffer | null = null;
      let filename: string | null = null;
      let mimetype: string = 'application/octet-stream';
      let downloaded = false;

      if (application.cvFilePath) {
        const filePath = path.resolve(application.cvFilePath);

        try {
          fileBuffer = await fs.readFile(filePath);
          filename = path.basename(filePath);
          mimetype = this.getMimetype(path.extname(filePath));
          downloaded = true;

          // Delete file after reading
          await fs.unlink(filePath);
          console.log(`Successfully deleted CV file: ${filePath}`);
        } catch (error) {
          if (error.code === 'ENOENT') {
            console.warn(
              `CV file not found (already deleted or missing): ${filePath}`,
            );
          } else {
            this.logger.log('warn', {
              message: `Failed to read/delete CV file: ${filePath}`,
              error,
              recruiterId,
              applicationId,
            });
          }
          fileBuffer = null;
          downloaded = false;
        }
      }

      const oldValues = { status: application.status };
      const newValues = { status: StatusApplication.REVIEWED };
      application.status = newValues.status;
      await queryRunner.manager.save(Application, application);

      this.logger.log('info', {
        message: 'recruiter successfully review application',
        recruiterId,
        applicationId,
      });

      await this.auditService.record({
        userId: recruiterId,
        entity: 'Application',
        entityId: application.id,
        action: AuditAction.UPDATE,
        oldValues,
        newValues,
        ipAddress: ip,
      });

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return success with optional file
      return {
        message: 'Application successfully reviewed',
        downloaded,
        filename: downloaded ? filename : null,
        mimetype: downloaded ? mimetype : null,
        data: downloaded ? fileBuffer?.toString('base64') : null,
        fileBuffer,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getMimetype(ext: string): string {
    const map: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return map[ext.toLowerCase()] || 'application/octet-stream';
  }

  async findOne(id: string) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['jobPoster'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return {
      ...application,
      cvFilePath: undefined,
    };
  }

  async validateApplication(
    id: string,
    dto: ValidateApplicationDto,
    userId: string,
    ip: string,
  ) {
    this.logger.log('info', {
      message: 'recruiter started to validating application',
      recruiterId: userId,
      jobPosterId: id,
      newStatus: dto.status,
    });
    const application = await this.findOne(id);

    if (application.jobPoster.userId !== userId) {
      this.logger.log('warn', {
        message:
          'failed validating, recruiter tried to access another applications',
        recruiterId: userId,
        jobPosterId: id,
      });
      throw new ForbiddenException(
        'You can only review applications for your own jobs',
      );
    }

    if (application.status !== StatusApplication.REVIEWED) {
      this.logger.log('warn', {
        message: 'skip validating, application not yet reviewed',
        recruiterId: userId,
        jobPosterId: id,
      });
      throw new ConflictException('Current application status is not reviewed');
    }

    const oldValues = { status: application.status };
    const newValues = { status: dto.status };
    Object.assign(application, newValues);
    const updatedApplication =
      await this.applicationsRepository.save(application);

    this.logger.log('info', {
      message: 'recruiter successfully validating application',
      recruiterId: userId,
      jobPosterId: id,
      oldStatus: oldValues,
      newStatus: dto.status,
    });

    await this.auditService.record({
      userId,
      entity: 'Application',
      entityId: application.id,
      action: AuditAction.UPDATE,
      oldValues,
      newValues,
      ipAddress: ip,
    });

    return updatedApplication;
  }
}
