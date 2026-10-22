import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, Equals, IsArray, IsNumber } from 'class-validator';

/** GeoJSON Point DTO. Coordinates are [longitude, latitude]. */
export class GeoPointDto {
  @ApiProperty({ enum: ['Point'], default: 'Point', example: 'Point' })
  @Equals('Point')
  type: 'Point' = 'Point';

  @ApiProperty({
    type: [Number],
    description: 'GeoJSON coordinates in [longitude, latitude] order.',
    example: [80.2707, 13.0827],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}
