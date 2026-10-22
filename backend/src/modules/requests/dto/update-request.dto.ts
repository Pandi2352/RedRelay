import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  REQUEST_STATUSES,
  type RequestStatus,
} from '../requests.constants';

export class UpdateRequestDto {
  @ApiPropertyOptional({
    enum: Object.values(REQUEST_STATUSES),
    description: 'Transition request status (e.g., cancelled).',
    example: REQUEST_STATUSES.CANCELLED,
  })
  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: RequestStatus;

  @ApiPropertyOptional({
    description: 'Extended or updated deadline.',
    example: '2026-10-22T20:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadlineAt?: Date;

  @ApiPropertyOptional({ example: 'ICU-Bed-04' })
  @IsOptional()
  @IsString()
  patientRef?: string;

  @ApiPropertyOptional({ example: 'Updated note from attending doctor.' })
  @IsOptional()
  @IsString()
  note?: string;
}
