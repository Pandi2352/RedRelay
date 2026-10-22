import { ApiProperty } from '@nestjs/swagger';
import { GeoPointDto } from '../../../common';
import {
  HOSPITAL_TYPES,
  type HospitalType,
  VERIFICATION_STATUSES,
  type VerificationStatus,
} from '../hospitals.constants';

export class HospitalVerificationDto {
  @ApiProperty({
    enum: Object.values(VERIFICATION_STATUSES),
    example: VERIFICATION_STATUSES.PENDING,
  })
  status!: VerificationStatus;

  @ApiProperty({ type: [String], example: [] })
  documents!: string[];

  @ApiProperty({ required: false, example: '6717a66b9319808a287c8e90' })
  reviewedBy?: string;

  @ApiProperty({ required: false, example: '2026-10-22T10:00:00.000Z' })
  reviewedAt?: Date;

  @ApiProperty({ required: false, example: 'Verified through official registry.' })
  note?: string;
}

export class HospitalResponseDto {
  @ApiProperty({ example: '6717a66b9319808a287c8e91' })
  id!: string;

  @ApiProperty({ example: 'City Care Hospital' })
  name!: string;

  @ApiProperty({ enum: Object.values(HOSPITAL_TYPES), example: HOSPITAL_TYPES.HOSPITAL })
  type!: HospitalType;

  @ApiProperty({ example: '100 Medical Center Way, Chennai' })
  address!: string;

  @ApiProperty({ type: GeoPointDto })
  location!: GeoPointDto;

  @ApiProperty({ example: '+91 98765 43210' })
  contactPhone!: string;

  @ApiProperty({ type: HospitalVerificationDto })
  verification!: HospitalVerificationDto;

  @ApiProperty({ example: '2026-10-22T09:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-10-22T09:00:00.000Z' })
  updatedAt!: Date;
}
