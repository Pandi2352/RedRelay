import { HttpStatus, Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { AppException, type PaginatedResult } from '../../common';
import { HospitalsService } from '../hospitals/hospitals.service';
import { VERIFICATION_STATUSES } from '../hospitals/hospitals.constants';
import type { CreateRequestDto, QueryRequestsDto, UpdateRequestDto } from './dto';
import { RequestResponseDto } from './dto/request-response.dto';
import {
  REQUEST_ERROR_CODES,
  REQUEST_STATUSES,
  REQUEST_URGENCIES,
} from './requests.constants';
import { RequestsRepository } from './requests.repository';
import {
  assertTransition,
  assertValidDeadline,
  calculateStatusAfterConfirmation,
} from './requests.rules';
import type { BloodRequest } from './schemas/blood-request.schema';

@Injectable()
export class RequestsService {
  constructor(
    private readonly repository: RequestsRepository,
    private readonly hospitalsService: HospitalsService,
  ) {}

  async create(dto: CreateRequestDto): Promise<RequestResponseDto> {
    assertValidDeadline(dto.deadlineAt);

    const hospital = await this.hospitalsService.findById(dto.hospitalId);
    if (hospital.verification.status !== VERIFICATION_STATUSES.VERIFIED) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        REQUEST_ERROR_CODES.HOSPITAL_NOT_VERIFIED,
        'Hospital must be verified before posting emergency blood requests.',
      );
    }

    const created = await this.repository.create({
      hospitalId: dto.hospitalId,
      bloodGroup: dto.bloodGroup,
      unitsNeeded: dto.unitsNeeded,
      urgency: dto.urgency ?? REQUEST_URGENCIES.NORMAL,
      deadlineAt: dto.deadlineAt,
      acceptCompatible: dto.acceptCompatible ?? true,
      patientRef: dto.patientRef,
      note: dto.note,
      location: hospital.location,
      status: REQUEST_STATUSES.OPEN,
      unitsConfirmed: 0,
      currentWave: 0,
    });

    return created;
  }

  async findAll(query: QueryRequestsDto): Promise<PaginatedResult<RequestResponseDto>> {
    const filter: FilterQuery<BloodRequest> = {};

    if (query.hospitalId) {
      filter.hospitalId = query.hospitalId;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.bloodGroup) {
      filter.bloodGroup = query.bloodGroup;
    }

    if (query.urgency) {
      filter.urgency = query.urgency;
    }

    const result = await this.repository.paginate(filter, query);
    return result;
  }

  async findById(id: string): Promise<RequestResponseDto> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        REQUEST_ERROR_CODES.REQUEST_NOT_FOUND,
        'Blood request not found.',
      );
    }
    return request;
  }

  async update(id: string, dto: UpdateRequestDto): Promise<RequestResponseDto> {
    const existing = await this.findById(id);

    const updateDoc: Record<string, unknown> = {};

    if (dto.status) {
      assertTransition(existing.status, dto.status);
      updateDoc.status = dto.status;
    }

    if (dto.deadlineAt) {
      assertValidDeadline(dto.deadlineAt);
      updateDoc.deadlineAt = dto.deadlineAt;
    }

    if (dto.patientRef !== undefined) {
      updateDoc.patientRef = dto.patientRef;
    }

    if (dto.note !== undefined) {
      updateDoc.note = dto.note;
    }

    const updated = await this.repository.updateById(id, { $set: updateDoc });

    if (!updated) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        REQUEST_ERROR_CODES.REQUEST_NOT_FOUND,
        'Blood request not found.',
      );
    }

    return updated;
  }

  async confirmUnit(id: string): Promise<RequestResponseDto> {
    const confirmed = await this.repository.confirmUnit(id);
    if (!confirmed) {
      throw new AppException(
        HttpStatus.CONFLICT,
        REQUEST_ERROR_CODES.REQUEST_FULL,
        'This request already has all needed units confirmed.',
      );
    }

    const targetStatus = calculateStatusAfterConfirmation(
      confirmed.unitsConfirmed,
      confirmed.unitsNeeded,
    );

    if (targetStatus !== confirmed.status) {
      const updated = await this.repository.updateById(id, { $set: { status: targetStatus } });
      return updated ?? confirmed;
    }

    return confirmed;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        REQUEST_ERROR_CODES.REQUEST_NOT_FOUND,
        'Blood request not found.',
      );
    }
  }
}
