import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Tutorial } from '../entities/tutorial.entity';
import { randomUUID } from 'crypto';
import { TutorialModel } from '../models/tutorial.model';
import { TutorialAdapter } from '../adapters/tutorial.adapter';
import { UpdateRequest } from '../types/update-request.type';
import { TutorialRepository } from './tutorial.repository';

@Injectable()
export class MikroOrmTutorialRepository extends TutorialRepository {
  constructor(private readonly em: EntityManager) {
    super();
  }

  async insert(
    data: Omit<TutorialModel, 'tutorialId'>,
  ): Promise<TutorialModel> {
    const tutorial: Tutorial = this.em.fork().create(Tutorial, {
      ...data,
      tutorialId: randomUUID(),
      postedAt: new Date(),
    });
    await this.em.fork().persistAndFlush(tutorial);
    return TutorialAdapter.fromEntityToModel(tutorial);
  }

  async findOneByName(title: string): Promise<TutorialModel | null> {
    const tutorial = await this.em.fork().findOne(Tutorial, { title });
    return tutorial ? TutorialAdapter.fromEntityToModel(tutorial) : null;
  }

  async findAll(
    filter: FilterQuery<TutorialModel>,
    options: FindOptions<TutorialModel>,
  ): Promise<TutorialModel[]> {
    const entities = await this.em.fork().find(Tutorial, filter, options);
    const models = entities.map((tutorial) =>
      TutorialAdapter.fromEntityToModel(tutorial),
    );
    return models;
  }

  async update(id: string, data: UpdateRequest): Promise<TutorialModel> {
    const tutorial = await this.em.fork().findOne(Tutorial, { tutorialId: id });
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with id ${id} not found`);
    }

    const updatedTutorial = this.em.fork().assign(tutorial, data);
    await this.em.fork().persistAndFlush(updatedTutorial);
    return TutorialAdapter.fromEntityToModel(updatedTutorial);
  }

  async delete(identifier: string): Promise<boolean> {
    const tutorial =
      (await this.em.fork().findOne(Tutorial, { tutorialId: identifier })) ??
      (await this.em.fork().findOne(Tutorial, { title: identifier }));

    if (!tutorial) return false;

    await this.em.fork().removeAndFlush(tutorial);
    return true;
  }
}
