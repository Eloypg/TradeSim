/* eslint-disable @typescript-eslint/unbound-method */
import { MikroOrmUserRepository } from '../../repositories/mikro-orm-user.repository';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../entities/user.entity';
import { Wallet } from '../../../wallet/entities/wallet.entity';
import { UserAdapter } from '../../adapters/user.adapter';
import { UserModel } from '../../models/user.model';
import { UpdateUserRequest } from '../../types/update-user.request.type';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe(MikroOrmUserRepository.name, () => {
  let repository: MikroOrmUserRepository;
  let entityManager: MockProxy<EntityManager>;

  const userEntity: User = {
    userId: '11111111-1111-1111-1111-111111111111',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    wallet: {
      walletId: '22222222-2222-2222-2222-222222222222',
      balance: 0,
      createdAt: new Date('2023-01-01T00:00:00Z'),
    } as Wallet,
  };

  const userModel: UserModel = {
    userId: '11111111-1111-1111-1111-111111111111',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
    wallet: {
      walletId: '22222222-2222-2222-2222-222222222222',
    },
  };

  beforeEach(async () => {
    entityManager = mock<EntityManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MikroOrmUserRepository,
        {
          provide: EntityManager,
          useValue: entityManager,
        },
      ],
    }).compile();

    repository = module.get<MikroOrmUserRepository>(MikroOrmUserRepository);

    entityManager.fork.mockReturnThis();

    jest.spyOn(UserAdapter, 'fromEntityToModel').mockReturnValue(userModel);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe(MikroOrmUserRepository.prototype.insert.name, () => {
    it('should create and return a new UserModel', async () => {
      entityManager.create.mockReturnValue(userEntity);
      entityManager.persistAndFlush.mockResolvedValue();

      const request = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
      };

      const result = await repository.insert(request);

      expect(entityManager.create).toHaveBeenCalledTimes(2);
      expect(entityManager.persistAndFlush).toHaveBeenCalled();
      expect(result).toEqual(userModel);
    });
  });

  describe(MikroOrmUserRepository.prototype.findAll.name, () => {
    it('should return an array of UserModel', async () => {
      entityManager.find.mockResolvedValue([userEntity]);

      const result = await repository.findAll({});

      expect(entityManager.find).toHaveBeenCalledWith(User, {}, undefined);
      expect(result).toEqual([userModel]);
    });

    it('should return empty array if no users found', async () => {
      entityManager.find.mockResolvedValue([]);

      const result = await repository.findAll({});

      expect(result).toEqual([]);
    });
  });

  describe(MikroOrmUserRepository.prototype.findOne.name, () => {
    it('should return UserModel when user is found', async () => {
      entityManager.findOne.mockResolvedValue(userEntity);

      const result = await repository.findOne({ userId: userEntity.userId });

      expect(entityManager.findOne).toHaveBeenCalledWith(
        User,
        { userId: userEntity.userId },
        undefined,
      );
      expect(result).toEqual(userModel);
    });

    it('should return null when user is not found', async () => {
      entityManager.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ userId: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe(MikroOrmUserRepository.prototype.update.name, () => {
    it('should update and return UserModel when user exists', async () => {
      entityManager.getReference.mockReturnValue(userEntity);
      entityManager.findOne.mockResolvedValue(userEntity);
      entityManager.persistAndFlush.mockResolvedValue();

      const updateRequest: UpdateUserRequest = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'new-hashed-password',
      };

      entityManager.assign.mockReturnValue({ ...userModel, ...updateRequest });

      const result = await repository.update(userEntity.userId, updateRequest);

      expect(entityManager.getReference).toHaveBeenCalledWith(
        User,
        userEntity.userId,
      );
      expect(entityManager.findOne).toHaveBeenCalled();
      expect(entityManager.assign).toHaveBeenCalled();
      expect(entityManager.persistAndFlush).toHaveBeenCalled();
      expect(result).toEqual(userModel);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      entityManager.getReference.mockReturnValue(userEntity);
      entityManager.findOne.mockResolvedValue(null);

      await expect(
        repository.update(userEntity.userId, {
          name: 'Test',
          email: 'test@test.com',
          password: '123',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe(MikroOrmUserRepository.prototype.delete.name, () => {
    it('should delete the user and return UserModel', async () => {
      entityManager.getReference.mockReturnValue(userEntity);
      entityManager.nativeDelete.mockResolvedValue(1);
      entityManager.remove.mockReturnThis();

      const result = await repository.delete(userEntity.userId);

      expect(entityManager.getReference).toHaveBeenCalledWith(
        User,
        userEntity.userId,
      );
      expect(entityManager.nativeDelete).toHaveBeenCalledWith(
        Wallet,
        userEntity.wallet,
      );
      expect(entityManager.remove).toHaveBeenCalledWith(userEntity);
      expect(result).toEqual(userModel);
    });
  });
});
