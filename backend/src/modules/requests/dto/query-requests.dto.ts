import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common';
import {
  BLOOD_GROUPS,
  type BloodGroup,
  REQUEST_STATUSES,
  REQUEST_URGENCIES,
  type RequestStatus,
  type RequestUrgency,
} from '../requests.constants';

export class QueryRequestsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by hospital MongoDB ObjectId.' })
  @IsOptional()
  @IsMongoId()
  hospitalId?: string;

  @ApiPropertyOptional({ enum: Object.values(REQUEST_STATUSES) })
  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: RequestStatus;

  @ApiPropertyOptional({ enum: BLOOD_GROUPS })
  @IsOptional()
  @IsEnum(BLOOD_GROUPS)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ enum: Object.values(REQUEST_URGENCIES) })
  @IsOptional()
  @IsEnum(REQUEST_URGENCIES)
  urgency?: RequestUrgency;
}
