/* eslint-disable @typescript-eslint/unbound-method */
import { EntityManager } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { mock, MockProxy } from 'jest-mock-extended';
import { TutorialAdapter } from '../../adapters/tutorial.adapter';
import { Tutorial } from '../../entities/tutorial.entity';
import { TutorialModel } from '../../models/tutorial.model';
import { MikroOrmTutorialRepository } from '../../repositories/mikro-orm-tutorial.repository';
import { UpdateRequest } from 'src/tutorial/types/update-request.type';
import { NotFoundException } from '@nestjs/common';

describe(MikroOrmTutorialRepository.name, () => {
  let repository: MikroOrmTutorialRepository;
  let em: MockProxy<EntityManager>;

  const id = randomUUID();

  const tutorialEntity: Tutorial = {
    tutorialId: id,
    title: 'Cómo usar NestJS con MikroORM',
    description: 'Un tutorial completo para integrar NestJS con MikroORM.',
    url: 'https://ejemplo.com/tutorial/nestjs-mikroorm',
    postedAt: new Date('2024-01-01T12:00:00Z'),
  };

  const tutorialModel: TutorialModel = {
    tutorialId: id,
    title: 'Cómo usar NestJS con MikroORM',
    description: 'Un tutorial completo para integrar NestJS con MikroORM.',
    url: 'https://ejemplo.com/tutorial/nestjs-mikroorm',
    postedAt: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(async () => {
    em = mock<EntityManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MikroOrmTutorialRepository,
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    repository = module.get<MikroOrmTutorialRepository>(
      MikroOrmTutorialRepository,
    );

    em.fork.mockReturnThis();

    jest
      .spyOn(TutorialAdapter, 'fromEntityToModel')
      .mockReturnValue(tutorialModel);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe(MikroOrmTutorialRepository.prototype.insert.name, () => {
    it('should insert a new tutorial and return the model', async () => {
      em.create.mockReturnValue(tutorialEntity);

      const result = await repository.insert(tutorialEntity);

      expect(em.create).toHaveBeenCalled();
      expect(em.persistAndFlush).toHaveBeenCalledWith(tutorialEntity);
      expect(result).toEqual(tutorialModel);
    });
  });

  describe(MikroOrmTutorialRepository.prototype.findOneByName.name, () => {
    it('should return a tutorial model if found', async () => {
      em.findOne.mockResolvedValue(tutorialEntity);

      const result = await repository.findOneByName('Test Tutorial');

      expect(em.findOne).toHaveBeenCalledWith(Tutorial, {
        title: 'Test Tutorial',
      });
      expect(result).toEqual(tutorialModel);
    });

    it('should return null if no tutorial found', async () => {
      em.findOne.mockResolvedValue(null);

      const result = await repository.findOneByName('Non-existent');

      expect(result).toBeNull();
    });
  });

  describe(MikroOrmTutorialRepository.prototype.findAll.name, () => {
    it('should return a list of tutorial models', async () => {
      em.find.mockResolvedValue([tutorialEntity]);

      const result = await repository.findAll({}, {});

      expect(em.find).toHaveBeenCalledWith(Tutorial, {}, {});
      expect(result).toEqual([tutorialModel]);
    });
  });

  describe(MikroOrmTutorialRepository.prototype.update.name, () => {
    it('should update and return the tutorial model', async () => {
      const updateRequest: UpdateRequest = {
        title: 'NEW TITLE',
        description: 'NEW DESCRIPTION',
      };
      const updatedTutorial: TutorialModel = {
        ...tutorialModel,
        ...updateRequest,
      };

      jest
        .spyOn(TutorialAdapter, 'fromEntityToModel')
        .mockReturnValue(updatedTutorial);

      em.findOne.mockResolvedValue(tutorialEntity);
      em.assign.mockReturnValue(updatedTutorial);

      const result = await repository.update(id, updateRequest);

      expect(em.findOne).toHaveBeenCalledWith(Tutorial, {
        tutorialId: id,
      });
      expect(em.assign).toHaveBeenCalledWith(tutorialEntity, updateRequest);
      expect(em.persistAndFlush).toHaveBeenCalledWith(updatedTutorial);
      expect(result).toEqual(updatedTutorial);
    });

    it('should throw NotFoundException if tutorial not found', async () => {
      em.findOne.mockResolvedValue(null);

      await expect(repository.update('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(MikroOrmTutorialRepository.prototype.delete.name, () => {
    it('should delete tutorial by ID', async () => {
      em.findOne.mockResolvedValueOnce(tutorialEntity); // First check by ID

      const result = await repository.delete('mocked-uuid');

      expect(em.removeAndFlush).toHaveBeenCalledWith(tutorialEntity);
      expect(result).toBe(true);
    });

    it('should delete tutorial by title if not found by ID', async () => {
      em.findOne
        .mockResolvedValueOnce(null) // First by ID
        .mockResolvedValueOnce(tutorialEntity); // Then by title

      const result = await repository.delete('Test Tutorial');

      expect(em.removeAndFlush).toHaveBeenCalledWith(tutorialEntity);
      expect(result).toBe(true);
    });

    it('should return false if tutorial not found by id or title', async () => {
      em.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
