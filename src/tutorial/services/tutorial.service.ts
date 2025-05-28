import { Injectable, NotFoundException } from '@nestjs/common';
import { TutorialModel } from '../models/tutorial.model';
import { UpdateRequest } from '../types/update-request.type';
import { FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { TutorialRepository } from '../repositories/tutorial.repository';

@Injectable()
export class TutorialService {
  constructor(private readonly tutorialRepo: TutorialRepository) {}

  async create(
    data: Omit<TutorialModel, 'tutorialId' | 'postedAt'>,
  ): Promise<TutorialModel> {
    return this.tutorialRepo.insert(data);
  }

  async getByName(title: string): Promise<TutorialModel> {
    const tutorial = await this.tutorialRepo.findOneByName(title);
    if (!tutorial) {
      throw new NotFoundException(`Tutorial with title '${title}' not found`);
    }
    return tutorial;
  }

  async getAll(
    filter: FilterQuery<TutorialModel> = {},
    options: FindOptions<TutorialModel> = {},
  ): Promise<TutorialModel[]> {
    return this.tutorialRepo.findAll(filter, options);
  }

  async update(id: string, data: UpdateRequest): Promise<TutorialModel> {
    return this.tutorialRepo.update(id, data);
  }

  async remove(identifier: string): Promise<void> {
    const deleted = await this.tutorialRepo.delete(identifier);
    if (!deleted) {
      throw new NotFoundException(
        `Tutorial with identifier '${identifier}' not found`,
      );
    }
  }
}
