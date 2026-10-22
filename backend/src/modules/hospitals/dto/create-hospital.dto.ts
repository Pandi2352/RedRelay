import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { GeoPointDto } from '../../../common';
import { HOSPITAL_TYPES, type HospitalType } from '../hospitals.constants';

export class CreateHospitalDto {
  @ApiProperty({ description: 'Name of the hospital or blood bank.', example: 'City Care Hospital' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    enum: Object.values(HOSPITAL_TYPES),
    description: 'Facility type.',
    example: HOSPITAL_TYPES.HOSPITAL,
  })
  @IsEnum(HOSPITAL_TYPES)
  type!: HospitalType;

  @ApiProperty({
    description: 'Street address of the facility.',
    example: '100 Medical Center Way, Chennai',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    type: GeoPointDto,
    description: 'GeoJSON Point location of the facility.',
  })
  @ValidateNested()
  @Type(() => GeoPointDto)
  location!: GeoPointDto;

  @ApiProperty({
    description: 'Direct emergency or desk phone number.',
    example: '+91 98765 43210',
  })
  @IsString()
  @IsNotEmpty()
  contactPhone!: string;
}
