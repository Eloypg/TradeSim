import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TutorialService } from '../services/tutorial.service';
import { TutorialModel } from '../models/tutorial.model';
import { UpdateRequest } from '../types/update-request.type';
import { FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { TutorialResponseDto } from '../dto/tutorial-response.dto';
import { CreateTutorialRequestDto } from '../dto/create-tutorial-request.dto';
import { TutorialAdapter } from '../adapters/tutorial.adapter';

@Controller('tutorials')
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Post()
  async create(
    @Body() data: CreateTutorialRequestDto,
  ): Promise<TutorialResponseDto> {
    const model = TutorialAdapter.fromRequestDtoToModel(data);
    const created = await this.tutorialService.create(model);
    return TutorialAdapter.fromModelToResponseDto(created);
  }

  @Get('by-title')
  async getByName(@Query('title') title: string): Promise<TutorialResponseDto> {
    const model = await this.tutorialService.getByName(title);
    return TutorialAdapter.fromModelToResponseDto(model);
  }

  @Get()
  async getAll(
    @Query('filter') filter: FilterQuery<TutorialModel>,
    @Query('options') options: FindOptions<TutorialModel>,
  ): Promise<TutorialResponseDto[]> {
    const models = await this.tutorialService.getAll(filter, options);
    const response = models.map((model) =>
      TutorialAdapter.fromModelToResponseDto(model),
    );
    return response;
  }

  @Patch(':tutorialId')
  async update(
    @Param('tutorialId', new ParseUUIDPipe()) tutorialId: string,
    @Body() data: UpdateRequest,
  ): Promise<TutorialResponseDto> {
    const model = await this.tutorialService.update(tutorialId, data);
    return TutorialAdapter.fromModelToResponseDto(model);
  }

  @Delete(':tutorialId')
  async remove(@Param('tutorialId') tutorialId: string): Promise<void> {
    await this.tutorialService.remove(tutorialId);
  }
}
