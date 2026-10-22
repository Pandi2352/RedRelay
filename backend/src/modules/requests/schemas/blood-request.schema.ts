import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseSchema, baseSchemaOptions, GeoPoint, GeoPointSchema } from '../../../common';
import {
  BLOOD_GROUPS,
  type BloodGroup,
  REQUEST_STATUSES,
  REQUEST_URGENCIES,
  type RequestStatus,
  type RequestUrgency,
  UNITS_LIMITS,
} from '../requests.constants';

@Schema(baseSchemaOptions)
export class BloodRequest extends BaseSchema {
  @Prop({ type: String, ref: 'Hospital', required: true })
  hospitalId!: string;

  @Prop({ type: String, required: false })
  createdBy?: string;

  @Prop({ type: String, enum: BLOOD_GROUPS, required: true })
  bloodGroup!: BloodGroup;

  @Prop({ type: Boolean, default: true })
  acceptCompatible!: boolean;

  @Prop({ type: Number, required: true, min: UNITS_LIMITS.MIN, max: UNITS_LIMITS.MAX })
  unitsNeeded!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  unitsConfirmed!: number;

  @Prop({
    type: String,
    enum: Object.values(REQUEST_URGENCIES),
    default: REQUEST_URGENCIES.NORMAL,
  })
  urgency!: RequestUrgency;

  @Prop({
    type: String,
    enum: Object.values(REQUEST_STATUSES),
    default: REQUEST_STATUSES.OPEN,
  })
  status!: RequestStatus;

  @Prop({ type: Date, required: true })
  deadlineAt!: Date;

  @Prop({ type: Number, default: 0, min: 0 })
  currentWave!: number;

  @Prop({ type: String, required: false, trim: true })
  patientRef?: string;

  @Prop({ type: String, required: false, trim: true })
  note?: string;

  @Prop({ type: GeoPointSchema, required: true })
  location!: GeoPoint;
}

export type BloodRequestDocument = HydratedDocument<BloodRequest>;

export const BloodRequestSchema = SchemaFactory.createForClass(BloodRequest);

BloodRequestSchema.index({ location: '2dsphere' });
BloodRequestSchema.index({ hospitalId: 1, status: 1, createdAt: -1 });
BloodRequestSchema.index({ status: 1, deadlineAt: 1 });
