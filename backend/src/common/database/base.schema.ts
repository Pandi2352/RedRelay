import { Prop, Schema } from '@nestjs/mongoose';
import { generateUuid } from '../utils/uuid.util';

/**
 * Abstract base schema class providing UUID _id and timestamps.
 * All domain collection schemas extend this class.
 */
@Schema()
export abstract class BaseSchema {
  @Prop({ type: String, default: generateUuid })
  _id!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
