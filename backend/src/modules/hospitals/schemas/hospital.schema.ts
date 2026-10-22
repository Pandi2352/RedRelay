import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseSchema, baseSchemaOptions, GeoPoint, GeoPointSchema } from '../../../common';
import {
  HOSPITAL_TYPES,
  type HospitalType,
  VERIFICATION_STATUSES,
  type VerificationStatus,
} from '../hospitals.constants';

@Schema({ _id: false })
export class HospitalVerification {
  @Prop({
    type: String,
    enum: Object.values(VERIFICATION_STATUSES),
    default: VERIFICATION_STATUSES.PENDING,
    required: true,
  })
  status!: VerificationStatus;

  @Prop({ type: [String], default: [] })
  documents!: string[];

  @Prop({ type: String, required: false })
  reviewedBy?: string;

  @Prop({ type: Date, required: false })
  reviewedAt?: Date;

  @Prop({ type: String, required: false })
  note?: string;
}

export const HospitalVerificationSchema = SchemaFactory.createForClass(HospitalVerification);

@Schema(baseSchemaOptions)
export class Hospital extends BaseSchema {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, enum: Object.values(HOSPITAL_TYPES), required: true })
  type!: HospitalType;

  @Prop({ type: String, required: true, trim: true })
  address!: string;

  @Prop({ type: GeoPointSchema, required: true })
  location!: GeoPoint;

  @Prop({ type: String, required: true, trim: true })
  contactPhone!: string;

  @Prop({ type: HospitalVerificationSchema, default: () => ({ status: VERIFICATION_STATUSES.PENDING, documents: [] }) })
  verification!: HospitalVerification;
}

export type HospitalDocument = HydratedDocument<Hospital>;

export const HospitalSchema = SchemaFactory.createForClass(Hospital);

HospitalSchema.index({ location: '2dsphere' });
HospitalSchema.index({ 'verification.status': 1 });
HospitalSchema.index({ name: 1 });
