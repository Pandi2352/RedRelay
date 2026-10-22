import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, Types } from 'mongoose';
import { BaseRepository, type Entity } from '../../common';
import { REQUEST_STATUSES } from './requests.constants';
import { BloodRequest } from './schemas/blood-request.schema';

type LeanDoc<T> = T & { _id: Types.ObjectId };

@Injectable()
export class RequestsRepository extends BaseRepository<BloodRequest> {
  constructor(@InjectModel(BloodRequest.name) requestModel: Model<BloodRequest>) {
    super(requestModel);
  }

  /**
   * Atomically confirms one unit if units are still needed and status is open/partially_matched.
   * Returns null if all units are already confirmed or status is terminal.
   */
  async confirmUnit(requestId: string): Promise<Entity<BloodRequest> | null> {
    const doc = await this.model
      .findOneAndUpdate(
        {
          _id: requestId,
          status: { $in: [REQUEST_STATUSES.OPEN, REQUEST_STATUSES.PARTIALLY_MATCHED] },
          $expr: { $lt: ['$unitsConfirmed', '$unitsNeeded'] },
        },
        { $inc: { unitsConfirmed: 1 } },
        { new: true },
      )
      .lean<LeanDoc<BloodRequest>>()
      .exec();

    return doc ? this.toEntity(doc) : null;
  }

  protected override toEntity(doc: LeanDoc<BloodRequest>): Entity<BloodRequest> {
    const entity = super.toEntity(doc);
    return {
      ...entity,
      hospitalId: doc.hospitalId ? (doc.hospitalId.toString() as unknown as Types.ObjectId) : doc.hospitalId,
    };
  }
}
