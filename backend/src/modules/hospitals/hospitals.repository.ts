import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';
import { BaseRepository, type Entity } from '../../common';
import { Hospital } from './schemas/hospital.schema';

@Injectable()
export class HospitalsRepository extends BaseRepository<Hospital> {
  constructor(@InjectModel(Hospital.name) hospitalModel: Model<Hospital>) {
    super(hospitalModel);
  }

  /** Finds hospitals sorted by distance from coordinates within maxDistanceMeters. */
  async findNearby(coordinates: [number, number], maxDistanceMeters: number): Promise<Entity<Hospital>[]> {
    const docs = await this.model
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: maxDistanceMeters,
          },
        },
      })
      .lean<Array<Hospital & { _id: Types.ObjectId }>>()
      .exec();

    return docs.map((doc) => this.toEntity(doc));
  }
}
