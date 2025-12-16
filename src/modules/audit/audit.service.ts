// src/modules/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction, AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async record(params: {
    userId?: string;
    entity: string;
    entityId: string;
    action: AuditAction;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
  }) {
    const audit = this.auditRepo.create(params);
    await this.auditRepo.save(audit);
  }
}
