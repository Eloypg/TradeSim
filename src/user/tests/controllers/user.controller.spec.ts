/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { UserDtoAdapter } from '../../adapters/user-dto.adapter';
import { UserModel } from '../../models/user.model';
import { UserRequestDto } from '../../dto/user-request.dto';
import { NotFoundException } from '@nestjs/common';

describe(UserController.name, () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const userModel: UserModel = {
    userId: '12345678-1234-1234-1234-123456789abc',
    name: 'Eloy',
    surname: 'Pardo',
    email: 'eloy@example.com',
    password: 'hashedpassword',
    wallet: {
      walletId: 'wallet-id',
    },
  };

  const userRequestDto: UserRequestDto = {
    name: 'Eloy',
    surname: 'Pardo',
    email: 'eloy@example.com',
    password: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  describe(UserController.prototype.create.name, () => {
    it('should create and return a user response dto', async () => {
      service.create.mockResolvedValue(userModel);

      const result = await controller.create(userRequestDto);

      expect(service.create).toHaveBeenCalledWith(
        UserDtoAdapter.fromRequestDtoToModelWithoutId(userRequestDto),
      );
      expect(result).toEqual(UserDtoAdapter.fromModelToResponseDto(userModel));
    });
  });

  describe(UserController.prototype.updateById.name, () => {
    it('should update user and return void', async () => {
      service.updateById.mockResolvedValue(true);

      await expect(
        controller.updateById(userModel.userId, userRequestDto),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      service.updateById.mockResolvedValue(false);

      await expect(
        controller.updateById(userModel.userId, userRequestDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe(UserController.prototype.deleteById.name, () => {
    it('should delete user and return void', async () => {
      service.deleteById.mockResolvedValue(true);

      await expect(
        controller.deleteById(userModel.userId),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if delete failed', async () => {
      service.deleteById.mockResolvedValue(false);

      await expect(controller.deleteById(userModel.userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(UserController.prototype.findOne.name, () => {
    it('should return a user response dto', async () => {
      service.findOne.mockResolvedValue(userModel);

      const result = await controller.findOne(userModel.userId);

      expect(service.findOne).toHaveBeenCalledWith({
        userId: userModel.userId,
      });
      expect(result).toEqual(UserDtoAdapter.fromModelToResponseDto(userModel));
    });

    it('should throw NotFoundException if user not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne(userModel.userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(UserController.prototype.find.name, () => {
    it('should return all user response dtos', async () => {
      service.findAll.mockResolvedValue([userModel]);

      const result = await controller.find({});

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([
        UserDtoAdapter.fromModelToResponseDto(userModel),
      ]);
    });

    it('should throw NotFoundException if no users found', async () => {
      service.findAll.mockResolvedValue(null as unknown as UserModel[]);

      await expect(controller.find({})).rejects.toThrow(NotFoundException);
    });
  });
});
