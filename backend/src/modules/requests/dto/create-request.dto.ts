import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  BLOOD_GROUPS,
  type BloodGroup,
  REQUEST_URGENCIES,
  type RequestUrgency,
  UNITS_LIMITS,
} from '../requests.constants';

export class CreateRequestDto {
  @ApiProperty({
    description: 'UUID of the verified hospital creating the request.',
    example: 'c6a99723-5e92-4114-8777-628b067d559a',
  })
  @IsUUID()
  @IsNotEmpty()
  hospitalId!: string;

  @ApiProperty({
    enum: BLOOD_GROUPS,
    description: 'Required blood group (e.g., O-, A+, B-).',
    example: 'O-',
  })
  @IsEnum(BLOOD_GROUPS)
  bloodGroup!: BloodGroup;

  @ApiProperty({
    description: 'Number of whole blood units needed (1 to 10).',
    minimum: UNITS_LIMITS.MIN,
    maximum: UNITS_LIMITS.MAX,
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  @Min(UNITS_LIMITS.MIN)
  @Max(UNITS_LIMITS.MAX)
  unitsNeeded!: number;

  @ApiPropertyOptional({
    enum: Object.values(REQUEST_URGENCIES),
    default: REQUEST_URGENCIES.NORMAL,
    example: REQUEST_URGENCIES.URGENT,
  })
  @IsOptional()
  @IsEnum(REQUEST_URGENCIES)
  urgency?: RequestUrgency;

  @ApiProperty({
    description: 'Deadline ISO-8601 UTC timestamp by when units must be at the hospital.',
    example: '2026-10-22T18:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  deadlineAt!: Date;

  @ApiPropertyOptional({
    description: 'Whether donors of compatible blood groups can be alerted in subsequent waves.',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  acceptCompatible?: boolean;

  @ApiPropertyOptional({
    description: 'Opaque internal hospital reference (bed, ward, trauma case).',
    example: 'ICU-Bed-04',
  })
  @IsOptional()
  @IsString()
  patientRef?: string;

  @ApiPropertyOptional({
    description: 'Optional clinical notes for responding donors.',
    example: 'Emergency surgery scheduled; please report directly to Blood Bank desk.',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
