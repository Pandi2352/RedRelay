import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** GeoJSON Point subdocument for MongoDB geospatial queries ($near, $geoNear). */
@Schema({ _id: false })
export class GeoPoint {
  @Prop({ type: String, enum: ['Point'], default: 'Point', required: true })
  type!: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates!: [number, number];
}

export const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);
