import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { UserRepository } from './user.repository';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';
import { UserAdapter } from '../adapters/user.adapter';
import { Wallet } from 'src/wallet/entities/wallet.entity';

export class MikroOrmUserRepository extends UserRepository {
  constructor(private readonly em: EntityManager) {
    super();
  }

  async insert(
    request: Omit<UserModel, 'userId' | 'wallet'>,
  ): Promise<UserModel> {
    const userId = randomUUID();
    const wallet = new Wallet();
    wallet.walletId = randomUUID();
    const userModel: UserModel = {
      ...request,
      userId,
      wallet,
    };
    const user = this.em
      .fork()
      .create(User, UserAdapter.fromModelToEntity(userModel));

    wallet.user = user;
    await this.em.fork().persistAndFlush(user);

    return UserAdapter.fromEntityToModel(user);
  }

  async findAll(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel[]> {
    const entities: User[] = await this.em.fork().find(User, filter, options);
    const models: UserModel[] = entities.map(
      (user: User): UserModel => UserAdapter.fromEntityToModel(user),
    );
    return models;
  }

  async findOne(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<UserModel | null> {
    const user: User | null = await this.em
      .fork()
      .findOne(User, filter, options);
    return user && UserAdapter.fromEntityToModel(user);
  }

  async delete(
    filter: FilterQuery<User>,
    options?: FindOptions<User>,
  ): Promise<number> {
    return await this.em.fork().nativeDelete(User, filter, options);
  }

  async update(
    filter: FilterQuery<User>,
    update: Partial<UserModel>,
    options?: FindOptions<User>,
  ): Promise<number> {
    return await this.em.fork().nativeUpdate(User, filter, update, options);
  }
}
