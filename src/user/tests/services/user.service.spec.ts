/* eslint-disable @typescript-eslint/unbound-method */
import { UserService } from '../../services/user.service';
import { UserRepository } from '../../repositories/user.repository';
import { UserModel } from '../../models/user.model';
import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFilter } from '../../filters/user.filter';

describe(UserService.name, () => {
  let service: UserService;
  let repository: MockProxy<UserRepository>;

  const userModel: UserModel = {
    userId: '12345678-1234-1234-1234-123456789abc',
    name: 'Juan',
    email: 'juan@example.com',
    password: 'hashedpassword123',
    wallet: {
      walletId: 'wallet-uuid',
    },
  };

  beforeEach(async () => {
    repository = mock<UserRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(UserService.prototype.create.name, () => {
    it('should return created user', async () => {
      repository.insert.mockResolvedValue(userModel);

      const result = await service.create({
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
      });

      expect(repository.insert).toHaveBeenCalled();
      expect(result).toEqual(userModel);
    });

    it('should return null if insert fails', async () => {
      repository.insert.mockResolvedValue(null as unknown as UserModel);

      const result = await service.create({
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
      });

      expect(result).toBeNull();
    });
  });

  describe(UserService.prototype.findOne.name, () => {
    it('should return a user if found', async () => {
      repository.findOne.mockResolvedValue(userModel);

      const result = await service.findOne({ email: 'juan@example.com' });

      expect(repository.findOne).toHaveBeenCalledWith({
        email: 'juan@example.com',
      });
      expect(result).toEqual(userModel);
    });

    it('should return null if no user found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne({ email: 'notfound@example.com' });

      expect(result).toBeNull();
    });
  });

  describe(UserService.prototype.findAll.name, () => {
    it('should return users when filter is provided', async () => {
      repository.findAll.mockResolvedValue([userModel]);

      const filter: UserFilter = { name: 'Juan' };
      const result = await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual([userModel]);
    });

    it('should return users when filter is not provided', async () => {
      repository.findAll.mockResolvedValue([userModel]);

      const result = await service.findAll({});

      expect(repository.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([userModel]);
    });
  });

  describe(UserService.prototype.updateById.name, () => {
    it('should return true if update was successful', async () => {
      repository.update.mockResolvedValue(userModel);

      const result = await service.updateById(userModel.userId, {
        name: 'Updated Name',
      });

      expect(repository.update).toHaveBeenCalledWith(userModel.userId, {
        name: 'Updated Name',
      });
      expect(result).toBe(true);
    });

    it('should return false if update failed', async () => {
      repository.update.mockResolvedValue(null as unknown as UserModel);

      const result = await service.updateById(userModel.userId, {
        name: 'Non-existent',
      });

      expect(result).toBe(false);
    });
  });

  describe(UserService.prototype.deleteById.name, () => {
    it('should return true if user was deleted', async () => {
      repository.delete.mockResolvedValue(userModel);

      const result = await service.deleteById(userModel.userId);

      expect(repository.delete).toHaveBeenCalledWith(userModel.userId);
      expect(result).toBe(true);
    });

    it('should return false if userId is empty', async () => {
      const result = await service.deleteById('');

      expect(result).toBe(false);
    });

    it('should return false if delete failed', async () => {
      repository.delete.mockResolvedValue(null as unknown as UserModel);

      const result = await service.deleteById('nonexistent-id');

      expect(result).toBe(false);
    });
  });
});
