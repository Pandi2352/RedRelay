import type { SchemaOptions } from 'mongoose';

/** Use on every schema: @Schema(baseSchemaOptions). Adds timestamps and exposes UUID `id` instead of `_id`. */
export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      if (ret._id !== undefined) {
        ret.id = typeof ret._id === 'string' ? ret._id : (ret._id as { toString(): string }).toString();
        delete ret._id;
      }
      return ret;
    },
  },
};
