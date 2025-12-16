import {
  Body,
  Controller,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.interface';
import { UserRole } from '../users/user.entity';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ValidateApplicationDto } from './dto/validate-application.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
  @UseInterceptors(FileInterceptor('cvFile'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateApplicationDto,
    description: 'Application data + CV file',
  })
  async createApplication(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: JwtPayload,
    @Ip() ip: string,
  ) {
    return this.applicationsService.createApplication(dto, file, user.sub, ip);
  }

  @Roles(UserRole.RECRUITER)
  @Patch(':id/review')
  async review(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @GetUser() user: JwtPayload,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const result = await this.applicationsService.reviewApplication(
      id,
      user.sub,
      ip,
    );

    if (!result.downloaded || !result.fileBuffer) {
      return res.json({
        message: result.message ?? 'Application reviewed, no CV available',
      });
    }

    res.set({
      'Content-Type': result.mimetype,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
      'Content-Length': result.fileBuffer.length,
    });

    return res.send(result.fileBuffer);
  }

  @Roles(UserRole.RECRUITER)
  @Patch(':id/validate')
  async validate(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ValidateApplicationDto,
    @GetUser() user: JwtPayload,
    @Ip() ip: string,
  ) {
    return this.applicationsService.validateApplication(id, dto, user.sub, ip);
  }
}
