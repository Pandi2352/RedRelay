import { HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import type { Entity } from '../../../common';
import { VERIFICATION_STATUSES } from '../../hospitals/hospitals.constants';
import { HospitalsService } from '../../hospitals/hospitals.service';
import {
  REQUEST_ERROR_CODES,
  REQUEST_STATUSES,
  REQUEST_URGENCIES,
} from '../requests.constants';
import { RequestsRepository } from '../requests.repository';
import { RequestsService } from '../requests.service';
import type { BloodRequest } from '../schemas/blood-request.schema';

describe('RequestsService', () => {
  let service: RequestsService;
  let repository: jest.Mocked<RequestsRepository>;
  let hospitalsService: jest.Mocked<HospitalsService>;

  const hospitalId = '6717a66b9319808a287c8e91';
  const requestId = '6717a66b9319808a287c8e92';
  const hospitalLocation = {
    type: 'Point' as const,
    coordinates: [80.2707, 13.0827] as [number, number],
  };

  const mockVerifiedHospital = {
    id: hospitalId,
    name: 'City Care Hospital',
    type: 'hospital' as const,
    address: '100 Medical Center Way',
    location: hospitalLocation,
    contactPhone: '+91 98765 43210',
    verification: {
      status: VERIFICATION_STATUSES.VERIFIED,
      documents: [],
    },
    createdAt: new Date('2026-10-22T09:00:00.000Z'),
    updatedAt: new Date('2026-10-22T09:00:00.000Z'),
  };

  const mockRequest: Entity<BloodRequest> = {
    id: requestId,
    hospitalId: new Types.ObjectId(hospitalId),
    bloodGroup: 'O-',
    acceptCompatible: true,
    unitsNeeded: 2,
    unitsConfirmed: 0,
    urgency: REQUEST_URGENCIES.NORMAL,
    status: REQUEST_STATUSES.OPEN,
    deadlineAt: new Date(Date.now() + 3600000),
    currentWave: 0,
    patientRef: 'ICU-4',
    note: 'Urgent',
    location: hospitalLocation,
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      paginate: jest.fn(),
      confirmUnit: jest.fn(),
    } as unknown as jest.Mocked<RequestsRepository>;

    hospitalsService = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<HospitalsService>;

    service = new RequestsService(repository, hospitalsService);
  });

  describe('create', () => {
    it('creates request copying verified hospital location', async () => {
      hospitalsService.findById.mockResolvedValue(mockVerifiedHospital);
      repository.create.mockResolvedValue(mockRequest);

      const futureDeadline = new Date(Date.now() + 3600000);
      const result = await service.create({
        hospitalId,
        bloodGroup: 'O-',
        unitsNeeded: 2,
        deadlineAt: futureDeadline,
      });

      expect(hospitalsService.findById).toHaveBeenCalledWith(hospitalId);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hospitalId: new Types.ObjectId(hospitalId),
          bloodGroup: 'O-',
          unitsNeeded: 2,
          location: hospitalLocation,
          status: REQUEST_STATUSES.OPEN,
          unitsConfirmed: 0,
        }),
      );
      expect(result).toEqual(mockRequest);
    });

    it('rejects creation if hospital is not verified', async () => {
      hospitalsService.findById.mockResolvedValue({
        ...mockVerifiedHospital,
        verification: { status: VERIFICATION_STATUSES.PENDING, documents: [] },
      });

      await expect(
        service.create({
          hospitalId,
          bloodGroup: 'O-',
          unitsNeeded: 2,
          deadlineAt: new Date(Date.now() + 3600000),
        }),
      ).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
        code: REQUEST_ERROR_CODES.HOSPITAL_NOT_VERIFIED,
      });
    });

    it('rejects creation if deadline is in the past', async () => {
      await expect(
        service.create({
          hospitalId,
          bloodGroup: 'O-',
          unitsNeeded: 2,
          deadlineAt: new Date(Date.now() - 10000),
        }),
      ).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        code: REQUEST_ERROR_CODES.INVALID_DEADLINE,
      });
    });
  });

  describe('findById', () => {
    it('returns the request when found', async () => {
      repository.findById.mockResolvedValue(mockRequest);

      const result = await service.findById(requestId);
      expect(result).toEqual(mockRequest);
    });

    it('throws 404 when request is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        code: REQUEST_ERROR_CODES.REQUEST_NOT_FOUND,
      });
    });
  });

  describe('confirmUnit', () => {
    it('atomically confirms unit and updates status to partially_matched on first unit', async () => {
      const confirmedOne: Entity<BloodRequest> = {
        ...mockRequest,
        unitsConfirmed: 1,
        unitsNeeded: 2,
        status: REQUEST_STATUSES.OPEN,
      };
      const updatedStatus: Entity<BloodRequest> = {
        ...confirmedOne,
        status: REQUEST_STATUSES.PARTIALLY_MATCHED,
      };

      repository.confirmUnit.mockResolvedValue(confirmedOne);
      repository.updateById.mockResolvedValue(updatedStatus);

      const result = await service.confirmUnit(requestId);

      expect(repository.confirmUnit).toHaveBeenCalledWith(requestId);
      expect(repository.updateById).toHaveBeenCalledWith(
        requestId,
        { $set: { status: REQUEST_STATUSES.PARTIALLY_MATCHED } },
      );
      expect(result).toEqual(updatedStatus);
    });

    it('atomically confirms unit and updates status to fulfilled when units match', async () => {
      const confirmedAll: Entity<BloodRequest> = {
        ...mockRequest,
        unitsConfirmed: 2,
        unitsNeeded: 2,
        status: REQUEST_STATUSES.PARTIALLY_MATCHED,
      };
      const updatedStatus: Entity<BloodRequest> = {
        ...confirmedAll,
        status: REQUEST_STATUSES.FULFILLED,
      };

      repository.confirmUnit.mockResolvedValue(confirmedAll);
      repository.updateById.mockResolvedValue(updatedStatus);

      const result = await service.confirmUnit(requestId);

      expect(repository.updateById).toHaveBeenCalledWith(
        requestId,
        { $set: { status: REQUEST_STATUSES.FULFILLED } },
      );
      expect(result).toEqual(updatedStatus);
    });

    it('throws 409 Conflict REQUEST_FULL if no units could be confirmed', async () => {
      repository.confirmUnit.mockResolvedValue(null);

      await expect(service.confirmUnit(requestId)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
        code: REQUEST_ERROR_CODES.REQUEST_FULL,
      });
    });
  });

  describe('update', () => {
    it('validates transition before updating status', async () => {
      repository.findById.mockResolvedValue(mockRequest);
      const updated: Entity<BloodRequest> = { ...mockRequest, status: REQUEST_STATUSES.CANCELLED };
      repository.updateById.mockResolvedValue(updated);

      const result = await service.update(requestId, {
        status: REQUEST_STATUSES.CANCELLED,
      });

      expect(result.status).toBe(REQUEST_STATUSES.CANCELLED);
    });

    it('rejects invalid state transition', async () => {
      const fulfilledRequest: Entity<BloodRequest> = {
        ...mockRequest,
        status: REQUEST_STATUSES.FULFILLED,
      };
      repository.findById.mockResolvedValue(fulfilledRequest);

      await expect(
        service.update(requestId, { status: REQUEST_STATUSES.OPEN }),
      ).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
        code: REQUEST_ERROR_CODES.INVALID_TRANSITION,
      });
    });
  });
});
