import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { UserFilter } from '../filters/user.filter';
import { UpdateUserRequest } from '../types/update-user.request.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    userModel: Omit<UserModel, 'userId' | 'wallet'>,
  ): Promise<UserModel> {
    const response = await this.userRepository.insert(userModel);
    return response ?? null;
  }

  async findOne(filter: UserFilter): Promise<UserModel | null> {
    const user = await this.userRepository.findOne(filter);
    return user ?? null;
  }

  async findAll(filter: UserFilter): Promise<UserModel[]> {
    if (!filter) {
      return await this.userRepository.findAll({});
    }
    const users = await this.userRepository.findAll(filter);
    return users;
  }

  async updateById(
    userId: string,
    updateRequest: UpdateUserRequest,
  ): Promise<boolean> {
    const updated = await this.userRepository.update(userId, updateRequest);
    return !!updated;
  }

  async deleteById(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const deleteResult = await this.userRepository.delete(userId);
    return !!deleteResult;
  }
}
