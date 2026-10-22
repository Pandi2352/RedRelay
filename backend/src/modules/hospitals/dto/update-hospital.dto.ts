import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateHospitalDto } from './create-hospital.dto';
import { VERIFICATION_STATUSES, type VerificationStatus } from '../hospitals.constants';

export class UpdateVerificationDto {
  @ApiPropertyOptional({
    enum: Object.values(VERIFICATION_STATUSES),
    example: VERIFICATION_STATUSES.VERIFIED,
  })
  @IsOptional()
  @IsEnum(VERIFICATION_STATUSES)
  status?: VerificationStatus;

  @ApiPropertyOptional({ type: [String], example: ['https://example.com/license.pdf'] })
  @IsOptional()
  @IsString({ each: true })
  documents?: string[];

  @ApiPropertyOptional({ example: 'Verified from state medical council registry.' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
  @ApiPropertyOptional({ type: UpdateVerificationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVerificationDto)
  verification?: UpdateVerificationDto;
}
