/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { TutorialService } from '../../services/tutorial.service';
import { TutorialRepository } from '../../repositories/tutorial.repository';
import { TutorialModel } from '../../models/tutorial.model';
import { NotFoundException } from '@nestjs/common';
import { UpdateRequest } from '../../types/update-request.type';
import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

describe(TutorialService.name, () => {
  let service: TutorialService;
  let tutorialRepo: MockProxy<TutorialRepository>;

  const id = randomUUID();

  const tutorial: TutorialModel = {
    tutorialId: id,
    title: 'Cómo usar NestJS con MikroORM',
    description: 'Un tutorial completo para integrar NestJS con MikroORM.',
    url: 'https://ejemplo.com/tutorial/nestjs-mikroorm',
    postedAt: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(async () => {
    tutorialRepo = mock<TutorialRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialService,
        {
          provide: TutorialRepository,
          useValue: tutorialRepo,
        },
      ],
    }).compile();

    service = module.get<TutorialService>(TutorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(TutorialService.prototype.create.name, () => {
    it('should create a new tutorial', async () => {
      tutorialRepo.insert.mockResolvedValue(tutorial);

      const result = await service.create({
        title: tutorial.title,
        description: tutorial.description,
        url: tutorial.url,
      });

      expect(tutorialRepo.insert).toHaveBeenCalledWith({
        title: tutorial.title,
        description: tutorial.description,
        url: tutorial.url,
      });
      expect(result).toEqual(tutorial);
    });
  });

  describe(TutorialService.prototype.getByName.name, () => {
    it('should return the tutorial if found by title', async () => {
      tutorialRepo.findOneByName.mockResolvedValue(tutorial);

      const result = await service.getByName(tutorial.title);

      expect(tutorialRepo.findOneByName).toHaveBeenCalledWith(tutorial.title);
      expect(result).toEqual(tutorial);
    });

    it('should throw NotFoundException if not found', async () => {
      tutorialRepo.findOneByName.mockResolvedValue(null);

      await expect(service.getByName('Non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(TutorialService.prototype.getAll.name, () => {
    it('should return all tutorials', async () => {
      tutorialRepo.findAll.mockResolvedValue([tutorial]);

      const filter: FilterQuery<TutorialModel> = {};
      const options: FindOptions<TutorialModel> = {};

      const result = await service.getAll(filter, options);

      expect(tutorialRepo.findAll).toHaveBeenCalledWith(filter, options);
      expect(result).toEqual([tutorial]);
    });
  });

  describe(TutorialService.prototype.update.name, () => {
    it('should update a tutorial and return the updated model', async () => {
      const updateData: UpdateRequest = {
        title: 'Nuevo título',
        description: 'Nueva descripción',
      };

      const updatedTutorial: TutorialModel = {
        ...tutorial,
        ...updateData,
      };

      tutorialRepo.update.mockResolvedValue(updatedTutorial);

      const result = await service.update(tutorial.tutorialId, updateData);

      expect(tutorialRepo.update).toHaveBeenCalledWith(
        tutorial.tutorialId,
        updateData,
      );
      expect(result).toEqual(updatedTutorial);
    });
  });

  describe(TutorialService.prototype.remove.name, () => {
    it('should remove the tutorial if found', async () => {
      tutorialRepo.delete.mockResolvedValue(true);

      await service.remove(tutorial.tutorialId);

      expect(tutorialRepo.delete).toHaveBeenCalledWith(tutorial.tutorialId);
    });

    it('should throw NotFoundException if tutorial not found', async () => {
      tutorialRepo.delete.mockResolvedValue(false);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
