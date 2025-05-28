import { FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { TutorialModel } from '../models/tutorial.model';
import { UpdateRequest } from '../types/update-request.type';

export abstract class TutorialRepository {
  abstract insert(
    data: Omit<TutorialModel, 'tutorialId' | 'postedAt'>,
  ): Promise<TutorialModel>;
  abstract findOneByName(title: string): Promise<TutorialModel | null>;
  abstract findAll(
    filter: FilterQuery<TutorialModel>,
    options: FindOptions<TutorialModel>,
  ): Promise<TutorialModel[]>;
  abstract update(id: string, data: UpdateRequest): Promise<TutorialModel>;
  abstract delete(id: string): Promise<boolean>;
}
