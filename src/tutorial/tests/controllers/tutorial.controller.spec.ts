/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TutorialController } from '../../controllers/tutorial.controller';
import { TutorialService } from '../../services/tutorial.service';
import { TutorialModel } from '../../models/tutorial.model';
import { mock, MockProxy } from 'jest-mock-extended';
import { TutorialAdapter } from '../../adapters/tutorial.adapter';
import { TutorialRequestDto } from '../../dto/tutorial-request.dto';
import { TutorialResponseDto } from '../../dto/tutorial-response.dto';
import { NotFoundException } from '@nestjs/common';
import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

describe(TutorialController.name, () => {
  let controller: TutorialController;
  let service: MockProxy<TutorialService>;

  const id = randomUUID();

  const model: TutorialModel = {
    tutorialId: id,
    title: 'Cómo usar NestJS con MikroORM',
    description: 'Un tutorial completo para integrar NestJS con MikroORM.',
    url: 'https://ejemplo.com/tutorial/nestjs-mikroorm',
    postedAt: new Date('2024-01-01T12:00:00Z'),
  };

  const requestDto: TutorialRequestDto = {
    title: model.title,
    description: model.description,
    url: model.url,
  };

  const responseDto: TutorialResponseDto = {
    title: model.title,
    description: model.description,
    url: model.url,
    postedAt: model.postedAt,
  };

  beforeEach(async () => {
    service = mock<TutorialService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialController],
      providers: [
        {
          provide: TutorialService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<TutorialController>(TutorialController);

    jest.spyOn(TutorialAdapter, 'fromRequestDtoToModel').mockReturnValue(model);

    jest
      .spyOn(TutorialAdapter, 'fromModelToResponseDto')
      .mockReturnValue(responseDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(TutorialController.prototype.create.name, () => {
    it('should create and return a tutorial', async () => {
      service.create.mockResolvedValue(model);

      const result = await controller.create(requestDto);

      expect(service.create).toHaveBeenCalledWith(model);
      expect(result).toEqual(responseDto);
    });
  });

  describe(TutorialController.prototype.getByName.name, () => {
    it('should return a tutorial by title', async () => {
      service.getByName.mockResolvedValue(model);

      const result = await controller.getByName(model.title);

      expect(service.getByName).toHaveBeenCalledWith(model.title);
      expect(result).toEqual(responseDto);
    });

    it('should throw NotFoundException if tutorial not found', async () => {
      service.getByName.mockRejectedValue(new NotFoundException());

      await expect(controller.getByName('Non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(TutorialController.prototype.getAll.name, () => {
    it('should return a list of tutorials', async () => {
      service.getAll.mockResolvedValue([model]);

      const filter: FilterQuery<TutorialModel> = {};
      const options: FindOptions<TutorialModel> = {};

      const result = await controller.getAll(filter, options);

      expect(service.getAll).toHaveBeenCalledWith(filter, options);
      expect(result).toEqual([responseDto]);
    });
  });

  describe(TutorialController.prototype.update.name, () => {
    it('should update and return the updated tutorial', async () => {
      service.update.mockResolvedValue(model);

      const result = await controller.update(id, requestDto);

      expect(service.update).toHaveBeenCalledWith(id, requestDto);
      expect(result).toEqual(responseDto);
    });

    it('should throw NotFoundException if tutorial not found', async () => {
      service.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(id, requestDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(TutorialController.prototype.remove.name, () => {
    it('should remove the tutorial', async () => {
      service.remove.mockResolvedValue();

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if tutorial not found', async () => {
      service.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
