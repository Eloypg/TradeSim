import { TutorialRequestDto } from '../dto/tutorial-request.dto';
import { TutorialResponseDto } from '../dto/tutorial-response.dto';
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

  static fromRequestDtoToModel(
    dto: TutorialRequestDto,
  ): Omit<TutorialModel, 'tutorialId' | 'postedAt'> {
    const model: Omit<TutorialModel, 'tutorialId' | 'postedAt'> =
      new TutorialModel();
    model.title = dto.title;
    model.description = dto.description;
    model.url = dto.url;
    return model;
  }

  static fromModelToResponseDto(model: TutorialModel): TutorialResponseDto {
    const dto: TutorialResponseDto = new TutorialResponseDto();
    dto.title = model.title;
    dto.description = model.description;
    dto.url = model.url;
    dto.postedAt = model.postedAt;
    return dto;
  }
}
