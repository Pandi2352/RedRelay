import { z } from 'zod';

export const createHospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name must be at least 2 characters'),
  licenseNumber: z.string().min(3, 'License number is required'),
  type: z.enum(['government', 'private', 'military', 'clinic']),
  street: z.string().min(2, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().default('India'),
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  phone: z.string().min(7, 'Phone number is required'),
  emergencyPhone: z.string().optional(),
  email: z.string().email('Valid email is required'),
  hasBloodBank: z.boolean().default(false),
  storageUnitsCapacity: z.coerce.number().optional(),
});

export type CreateHospitalFormData = z.infer<typeof createHospitalSchema>;
