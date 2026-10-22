import { HttpStatus, Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { AppException, type PaginatedResult } from '../../common';
import type { CreateHospitalDto, QueryHospitalsDto, UpdateHospitalDto } from './dto';
import { HospitalResponseDto } from './dto/hospital-response.dto';
import { HOSPITAL_ERROR_CODES } from './hospitals.constants';
import { HospitalsRepository } from './hospitals.repository';
import type { Hospital } from './schemas/hospital.schema';

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class HospitalsService {
  constructor(private readonly repository: HospitalsRepository) {}

  async create(dto: CreateHospitalDto): Promise<HospitalResponseDto> {
    const created = await this.repository.create({
      name: dto.name,
      type: dto.type,
      address: dto.address,
      location: dto.location,
      contactPhone: dto.contactPhone,
    });
    return created;
  }

  async findAll(query: QueryHospitalsDto): Promise<PaginatedResult<HospitalResponseDto>> {
    const filter: FilterQuery<Hospital> = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.status) {
      filter['verification.status'] = query.status;
    }

    if (query.search?.trim()) {
      filter.name = { $regex: escapeRegex(query.search.trim()), $options: 'i' };
    }

    const result = await this.repository.paginate(filter, query);
    return result;
  }

  async findById(id: string): Promise<HospitalResponseDto> {
    const hospital = await this.repository.findById(id);
    if (!hospital) {
      throw new AppException(HttpStatus.NOT_FOUND, HOSPITAL_ERROR_CODES.HOSPITAL_NOT_FOUND, 'Hospital not found.');
    }
    return hospital;
  }

  async update(id: string, dto: UpdateHospitalDto): Promise<HospitalResponseDto> {
    const updateDoc: Record<string, unknown> = {};

    if (dto.name !== undefined) updateDoc.name = dto.name;
    if (dto.type !== undefined) updateDoc.type = dto.type;
    if (dto.address !== undefined) updateDoc.address = dto.address;
    if (dto.location !== undefined) updateDoc.location = dto.location;
    if (dto.contactPhone !== undefined) updateDoc.contactPhone = dto.contactPhone;

    if (dto.verification) {
      if (dto.verification.status !== undefined) {
        updateDoc['verification.status'] = dto.verification.status;
      }
      if (dto.verification.documents !== undefined) {
        updateDoc['verification.documents'] = dto.verification.documents;
      }
      if (dto.verification.note !== undefined) {
        updateDoc['verification.note'] = dto.verification.note;
      }
    }

    const updated = await this.repository.updateById(id, { $set: updateDoc });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, HOSPITAL_ERROR_CODES.HOSPITAL_NOT_FOUND, 'Hospital not found.');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, HOSPITAL_ERROR_CODES.HOSPITAL_NOT_FOUND, 'Hospital not found.');
    }
  }
}
