import type { FilterQuery, Model, SortOrder, UpdateQuery } from 'mongoose';
import type { PaginatedResult } from '../types';
import { createPaginatedResult, toSkip, type PageRequest } from '../utils/pagination.util';

/** Plain object returned by repositories: document fields without `_id`, plus a string UUID `id`. */
export type Entity<T> = Omit<T, '_id'> & { id: string };

export type LeanDoc<T> = T & { _id: string };

/**
 * Generic Mongo access using UUID string identifiers.
 * Always returns lean plain objects, never hydrated documents.
 */
export abstract class BaseRepository<T extends object> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<Entity<T>> {
    const doc = await this.model.create(data);
    return this.toEntity(doc.toObject() as LeanDoc<T>);
  }

  async findById(id: string): Promise<Entity<T> | null> {
    const doc = await this.model.findById(id).lean<LeanDoc<T>>().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findOne(filter: FilterQuery<T>): Promise<Entity<T> | null> {
    const doc = await this.model.findOne(filter).lean<LeanDoc<T>>().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<Entity<T> | null> {
    const doc = await this.model.findByIdAndUpdate(id, update, { new: true }).lean<LeanDoc<T>>().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async paginate(
    filter: FilterQuery<T>,
    page: PageRequest,
    sort: Record<string, SortOrder> = { createdAt: -1 },
  ): Promise<PaginatedResult<Entity<T>>> {
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(toSkip(page)).limit(page.limit).lean<LeanDoc<T>[]>().exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return createPaginatedResult(
      docs.map((doc) => this.toEntity(doc)),
      page,
      total,
    );
  }

  protected toEntity({ _id, ...rest }: LeanDoc<T>): Entity<T> {
    return { ...(rest as unknown as T), id: String(_id) };
  }
}
