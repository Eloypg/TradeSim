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
  HttpStatus,
} from '@nestjs/common';
import { TutorialService } from '../services/tutorial.service';
import { TutorialModel } from '../models/tutorial.model';
import { FilterQuery, FindOptions } from '@mikro-orm/postgresql';
import { TutorialResponseDto } from '../dto/tutorial-response.dto';
import { TutorialRequestDto } from '../dto/tutorial-request.dto';
import { TutorialAdapter } from '../adapters/tutorial.adapter';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('v1/tutorials')
@ApiTags('Tutorials')
@ApiBadRequestResponse({
  description: 'Validation error',
  type: HttpStatus.BAD_REQUEST.toString(),
})
@ApiForbiddenResponse({
  description: 'Forbidden error',
  type: HttpStatus.FORBIDDEN.toString(),
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
})
export class TutorialController {
  constructor(private readonly tutorialService: TutorialService) {}

  @Post()
  @ApiOperation({ summary: 'Create a tutorial' })
  @ApiCreatedResponse({
    description: 'Tutorial created correctly',
    type: TutorialResponseDto,
  })
  async create(@Body() data: TutorialRequestDto): Promise<TutorialResponseDto> {
    const model = TutorialAdapter.fromRequestDtoToModel(data);
    const created = await this.tutorialService.create(model);
    return TutorialAdapter.fromModelToResponseDto(created);
  }

  @Get('by-title')
  @ApiOperation({ summary: 'Get tutorial by title' })
  @ApiOkResponse({ description: 'Tutorial found', type: TutorialResponseDto })
  @ApiNotFoundResponse({ description: 'Tutorial not found' })
  @ApiQuery({ name: 'title', required: true, type: String })
  async getByName(@Query('title') title: string): Promise<TutorialResponseDto> {
    const model = await this.tutorialService.getByName(title);
    return TutorialAdapter.fromModelToResponseDto(model);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tutorials' })
  @ApiOkResponse({
    description: 'List of tutorials',
    type: [TutorialResponseDto],
  })
  async getAll(
    @Query('filter') filter: FilterQuery<TutorialModel>,
    @Query('options') options: FindOptions<TutorialModel>,
  ): Promise<TutorialResponseDto[]> {
    const models = await this.tutorialService.getAll(filter, options);
    return models.map((model) => TutorialAdapter.fromModelToResponseDto(model));
  }

  @Patch(':tutorialId')
  @ApiOperation({ summary: 'Update tutorial' })
  @ApiNoContentResponse({ description: 'Tutorial updated' })
  @ApiNotFoundResponse({ description: 'Tutorial not found' })
  @ApiParam({ name: 'tutorialId', type: String, required: true })
  async update(
    @Param('tutorialId', new ParseUUIDPipe()) tutorialId: string,
    @Body() data: Partial<TutorialRequestDto>,
  ): Promise<TutorialResponseDto> {
    const model = await this.tutorialService.update(tutorialId, data);
    return TutorialAdapter.fromModelToResponseDto(model);
  }

  @Delete(':tutorialId')
  @ApiOperation({ summary: 'Delete tutorial' })
  @ApiNoContentResponse({ description: 'Tutorial deleted' })
  @ApiNotFoundResponse({ description: 'Tutorial not found' })
  @ApiParam({ name: 'tutorialId', type: String, required: true })
  async remove(@Param('tutorialId') tutorialId: string): Promise<void> {
    await this.tutorialService.remove(tutorialId);
  }
}
