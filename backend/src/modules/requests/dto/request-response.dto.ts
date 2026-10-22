import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GeoPointDto } from '../../../common';
import {
  BLOOD_GROUPS,
  type BloodGroup,
  REQUEST_STATUSES,
  REQUEST_URGENCIES,
  type RequestStatus,
  type RequestUrgency,
} from '../requests.constants';

export class RequestResponseDto {
  @ApiProperty({ example: '6717a66b9319808a287c8e92' })
  id!: string;

  @ApiProperty({ example: '6717a66b9319808a287c8e91' })
  hospitalId!: string;

  @ApiProperty({ enum: BLOOD_GROUPS, example: 'O-' })
  bloodGroup!: BloodGroup;

  @ApiProperty({ example: true })
  acceptCompatible!: boolean;

  @ApiProperty({ example: 2 })
  unitsNeeded!: number;

  @ApiProperty({ example: 0 })
  unitsConfirmed!: number;

  @ApiProperty({ enum: Object.values(REQUEST_URGENCIES), example: REQUEST_URGENCIES.NORMAL })
  urgency!: RequestUrgency;

  @ApiProperty({ enum: Object.values(REQUEST_STATUSES), example: REQUEST_STATUSES.OPEN })
  status!: RequestStatus;

  @ApiProperty({ example: '2026-10-22T18:00:00.000Z' })
  deadlineAt!: Date;

  @ApiProperty({ example: 0 })
  currentWave!: number;

  @ApiPropertyOptional({ example: 'ICU-Bed-04' })
  patientRef?: string;

  @ApiPropertyOptional({ example: 'Emergency surgery scheduled.' })
  note?: string;

  @ApiProperty({ type: GeoPointDto })
  location!: GeoPointDto;

  @ApiProperty({ example: '2026-10-22T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-10-22T10:00:00.000Z' })
  updatedAt!: Date;
}
