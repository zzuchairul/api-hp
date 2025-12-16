// src/modules/auth/dto/register-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class LoginResponseDTO {
  @ApiProperty({ example: 'eyJh........' })
  accessToken: string;

  @ApiProperty({
    example: 'candidate',
    enum: ['candidate', 'company'],
  })
  @IsEnum(['USER', 'COMPANY'])
  role: string;
}
