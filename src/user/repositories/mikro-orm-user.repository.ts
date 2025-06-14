import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';
import { UserAdapter } from '../adapters/user.adapter';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { UpdateUserRequest } from '../types/update-user.request.type';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MikroOrmUserRepository extends UserRepository {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async insert(
    request: Omit<UserModel, 'userId' | 'wallet'>,
  ): Promise<UserModel> {
    const em = this.entityManager.fork();

    let user = new User();
    const userId = randomUUID();

    const wallet: Wallet = em.create(Wallet, {
      walletId: randomUUID(),
      balance: 0,
      createdAt: new Date(),
      user,
    });

    user = em.create(User, {
      ...request,
      userId,
      wallet,
    });

    await em.persistAndFlush(user);

    return UserAdapter.fromEntityToModel(user);
  }

  async findAll(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel[]> {
    const em = this.entityManager.fork();

    const entities: User[] = await em.find(User, filter, options);
    const models: UserModel[] = entities.map(
      (user: User): UserModel => UserAdapter.fromEntityToModel(user),
    );
    return models;
  }

  async findOne(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel | null> {
    const em = this.entityManager.fork();

    const user: User | null = await em.findOne(User, filter, options);
    return user && UserAdapter.fromEntityToModel(user);
  }

  async update(
    id: string,
    updateRequest: UpdateUserRequest,
  ): Promise<UserModel> {
    const em = this.entityManager.fork();

    const userToUpdateReference = em.getReference(User, id);

    const userToUpdate = await em.findOne(User, userToUpdateReference);

    if (!userToUpdate) {
      throw new NotFoundException();
    }

    const updatedUser = em.assign(userToUpdate, {
      ...updateRequest,
      userId: id,
      wallet: userToUpdate.wallet,
    });

    await em.persistAndFlush(updatedUser);

    return UserAdapter.fromEntityToModel(updatedUser);
  }

  async delete(id: string): Promise<UserModel> {
    const em = this.entityManager.fork();

    const user = em.getReference(User, id);

    await em.nativeDelete(Wallet, user.wallet);

    await em.remove(user).flush();

    return UserAdapter.fromEntityToModel(user);
  }
}
