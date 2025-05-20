import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { UserRepository } from './user.repository';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';
import { UserAdapter } from '../adapters/user.adapter';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { UpdateUserRequest } from '../types/update-user.request.type';

export class MikroOrmUserRepository extends UserRepository {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async insert(
    request: Omit<UserModel, 'userId' | 'wallet'>,
  ): Promise<UserModel> {
    const em = this.entityManager.fork();

    const userId = randomUUID();
    const wallet = new Wallet();
    wallet.walletId = randomUUID();

    const user: User = em.create(User, {
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

    const userToUpdate = em.getReference(User, id);

    const updatedUser = em.assign(userToUpdate, { ...updateRequest });

    await em.persistAndFlush(updatedUser);

    return UserAdapter.fromEntityToModel(updatedUser);
  }

  async delete(id: string): Promise<UserModel> {
    const em = this.entityManager.fork();

    const user = em.getReference(User, id);

    await em.remove(user).flush();

    return UserAdapter.fromEntityToModel(user);
  }
}
