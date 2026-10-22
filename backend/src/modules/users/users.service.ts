import { Injectable } from '@nestjs/common';
import type { Entity } from '../../common/database';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: Partial<User>): Promise<Entity<User>> {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string): Promise<Entity<User> | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<Entity<User> | null> {
    return this.usersRepository.findById(id);
  }

  async updateRefreshTokenHash(userId: string, hash: string | null): Promise<void> {
    await this.usersRepository.updateRefreshTokenHash(userId, hash);
  }
}
