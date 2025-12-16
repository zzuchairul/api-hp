import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PublicUserDto {
  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'candidate',
    enum: ['candidate', 'recruiter'],
  })
  role: string;

  @Expose()
  @ApiProperty({ example: '2025-12-16T10:00:00.000Z' })
  created_at: Date;
}
