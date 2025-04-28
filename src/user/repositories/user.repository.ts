import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { UserModel } from '../models/user.model';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract insert(
    request: Omit<UserModel, 'userId' | 'wallet'>,
  ): Promise<UserModel>;

  abstract findAll(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel[]>;

  abstract findOne(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel | null>;

  abstract delete(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<number>;

  abstract update(
    filter: FilterQuery<User>,
    update: Partial<UserModel>,
    options?: FindOptions<User>,
  ): Promise<number>;
}
