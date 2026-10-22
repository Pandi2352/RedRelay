import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseSchema, baseSchemaOptions } from '../../../common/database';
import { Role } from '../../../common/types';

export type UserStatus = 'active' | 'suspended';

@Schema(baseSchemaOptions)
export class User extends BaseSchema {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ type: String })
  passwordHash?: string;

  @Prop({ type: String, sparse: true })
  googleId?: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ required: true, enum: Role, default: Role.Donor })
  role!: Role;

  @Prop({ type: Date })
  emailVerifiedAt?: Date;

  @Prop({ required: true, enum: ['active', 'suspended'], default: 'active' })
  status!: UserStatus;

  @Prop({ type: String })
  refreshTokenHash?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1 });
