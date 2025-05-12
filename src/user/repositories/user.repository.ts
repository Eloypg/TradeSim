import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { UserModel } from '../models/user.model';
import { User } from '../entities/user.entity';
import { UpdateUserRequest } from '../types/update-user.request.type';

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

  abstract update(
    id: string,
    updateRequest: UpdateUserRequest,
  ): Promise<UserModel>;

  abstract delete(id: string): Promise<UserModel>;
}
