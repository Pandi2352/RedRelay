import type { SchemaOptions } from 'mongoose';

/** Use on every schema: @Schema(baseSchemaOptions). Adds timestamps and exposes `id` instead of `_id`. */
export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id;
      return ret;
    },
  },
};
