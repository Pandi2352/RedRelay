import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common';
import {
  HOSPITAL_TYPES,
  type HospitalType,
  VERIFICATION_STATUSES,
  type VerificationStatus,
} from '../hospitals.constants';

export class QueryHospitalsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Object.values(HOSPITAL_TYPES) })
  @IsOptional()
  @IsEnum(HOSPITAL_TYPES)
  type?: HospitalType;

  @ApiPropertyOptional({ enum: Object.values(VERIFICATION_STATUSES) })
  @IsOptional()
  @IsEnum(VERIFICATION_STATUSES)
  status?: VerificationStatus;

  @ApiPropertyOptional({ description: 'Filter by hospital name (case-insensitive substring).' })
  @IsOptional()
  @IsString()
  search?: string;
}
