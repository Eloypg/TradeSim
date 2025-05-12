import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { UserRepository } from './user.repository';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';
import { User } from '../entities/user.entity';
import { UserAdapter } from '../adapters/user.adapter';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { UpdateUserRequest } from '../types/update-user.request.type';

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

    const user: User = this.em.fork().create(User, {
      ...request,
      userId,
      wallet,
    });

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

  async update(
    id: string,
    updateRequest: UpdateUserRequest,
  ): Promise<UserModel> {
    const entMan = this.em.fork();

    const userToUpdate = entMan.getReference(User, id);

    const updatedUser = entMan.assign(userToUpdate, { ...updateRequest });

    await entMan.persistAndFlush(updatedUser);

    return UserAdapter.fromEntityToModel(updatedUser);
  }

  async delete(id: string): Promise<UserModel> {
    const entMan = this.em.fork();

    const user = entMan.getReference(User, id);

    await entMan.remove(user).flush();

    return UserAdapter.fromEntityToModel(user);
  }
}
