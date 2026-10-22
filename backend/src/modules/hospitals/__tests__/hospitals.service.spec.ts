import { HttpStatus } from '@nestjs/common';
import { AppException, type Entity } from '../../../common';
import { HOSPITAL_ERROR_CODES, HOSPITAL_TYPES, VERIFICATION_STATUSES } from '../hospitals.constants';
import { HospitalsRepository } from '../hospitals.repository';
import { HospitalsService } from '../hospitals.service';
import type { Hospital } from '../schemas/hospital.schema';

describe('HospitalsService', () => {
  let service: HospitalsService;
  let repository: jest.Mocked<HospitalsRepository>;

  const mockHospital: Entity<Hospital> = {
    id: 'c6a99723-5e92-4114-8777-628b067d559a',
    name: 'City Care Hospital',
    type: HOSPITAL_TYPES.HOSPITAL,
    address: '100 Medical Center Way, Chennai',
    location: { type: 'Point' as const, coordinates: [80.2707, 13.0827] as [number, number] },
    contactPhone: '+91 98765 43210',
    verification: {
      status: VERIFICATION_STATUSES.PENDING,
      documents: [],
    },
    createdAt: new Date('2026-10-22T09:00:00.000Z'),
    updatedAt: new Date('2026-10-22T09:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      paginate: jest.fn(),
      findNearby: jest.fn(),
    } as unknown as jest.Mocked<HospitalsRepository>;

    service = new HospitalsService(repository);
  });

  describe('create', () => {
    it('creates and returns a hospital', async () => {
      repository.create.mockResolvedValue(mockHospital);

      const result = await service.create({
        name: mockHospital.name,
        type: mockHospital.type,
        address: mockHospital.address,
        location: mockHospital.location,
        contactPhone: mockHospital.contactPhone,
      });

      expect(repository.create).toHaveBeenCalledWith({
        name: mockHospital.name,
        type: mockHospital.type,
        address: mockHospital.address,
        location: mockHospital.location,
        contactPhone: mockHospital.contactPhone,
      });
      expect(result).toEqual(mockHospital);
    });
  });

  describe('findAll', () => {
    it('passes search, status, and type filters to repository.paginate', async () => {
      const paginated = {
        items: [mockHospital],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
      };
      repository.paginate.mockResolvedValue(paginated);

      const query = { page: 1, limit: 10, search: 'City', type: HOSPITAL_TYPES.HOSPITAL, status: VERIFICATION_STATUSES.PENDING };
      const result = await service.findAll(query);

      expect(repository.paginate).toHaveBeenCalledWith(
        {
          name: { $regex: 'City', $options: 'i' },
          type: HOSPITAL_TYPES.HOSPITAL,
          'verification.status': VERIFICATION_STATUSES.PENDING,
        },
        query,
      );
      expect(result).toEqual(paginated);
    });
  });

  describe('findById', () => {
    it('returns the hospital if found', async () => {
      repository.findById.mockResolvedValue(mockHospital);

      const result = await service.findById(mockHospital.id);
      expect(result).toEqual(mockHospital);
    });

    it('throws AppException with HOSPITAL_NOT_FOUND if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(AppException);
      await expect(service.findById('nonexistent')).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        code: HOSPITAL_ERROR_CODES.HOSPITAL_NOT_FOUND,
      });
    });
  });

  describe('update', () => {
    it('updates allowed fields and returns updated hospital', async () => {
      const updated = { ...mockHospital, name: 'Updated Care Hospital' };
      repository.updateById.mockResolvedValue(updated);

      const result = await service.update(mockHospital.id, {
        name: 'Updated Care Hospital',
        verification: { status: VERIFICATION_STATUSES.VERIFIED },
      });

      expect(repository.updateById).toHaveBeenCalledWith(mockHospital.id, {
        $set: {
          name: 'Updated Care Hospital',
          'verification.status': VERIFICATION_STATUSES.VERIFIED,
        },
      });
      expect(result).toEqual(updated);
    });

    it('throws 404 when updating non-existent hospital', async () => {
      repository.updateById.mockResolvedValue(null);

      await expect(service.update('nonexistent', { name: 'New' })).rejects.toThrow(AppException);
    });
  });

  describe('remove', () => {
    it('deletes hospital when found', async () => {
      repository.deleteById.mockResolvedValue(true);

      await expect(service.remove(mockHospital.id)).resolves.toBeUndefined();
      expect(repository.deleteById).toHaveBeenCalledWith(mockHospital.id);
    });

    it('throws 404 when deleting non-existent hospital', async () => {
      repository.deleteById.mockResolvedValue(false);

      await expect(service.remove('nonexistent')).rejects.toThrow(AppException);
    });
  });
});
