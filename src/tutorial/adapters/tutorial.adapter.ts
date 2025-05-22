import { Tutorial } from '../entities/tutorial.entity';
import { TutorialModel } from '../models/tutorial.model';

export class TutorialAdapter {
  static fromEntityToModel(entity: Tutorial): TutorialModel {
    const model: TutorialModel = new TutorialModel();
    model.tutorialId = entity.tutorialId;
    model.title = entity.title;
    model.description = entity.description;
    model.url = entity.url;
    model.postedAt = entity.postedAt;
    return model;
  }
}
