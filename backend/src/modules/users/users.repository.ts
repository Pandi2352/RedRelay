import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository, type Entity } from '../../common/database';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }

  async findByEmail(email: string): Promise<Entity<User> | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase().trim() }).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByGoogleId(googleId: string): Promise<Entity<User> | null> {
    const doc = await this.model.findOne({ googleId }).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string | null): Promise<void> {
    await this.model
      .updateOne({ _id: userId }, { $set: { refreshTokenHash: refreshTokenHash ?? undefined } })
      .exec();
  }
}
