import {
  Body,
  Controller,
  //HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserDtoAdapter } from '../adapters/user-dto.adapter';
import { UserFilter } from '../filters/user.filter';
import { UserModel } from '../models/user.model';

@Controller('v1/user')
/*@ApiSecurity('api_key') // ?????
@ApiTags('User') // ?????
@ApiBadRequestResponse({
  description: 'Validation error',
  type: HttpStatus.BAD_REQUEST,
})
@ApiForbiddenResponse({
  description: 'Forbbiden error',
  type: HttpStatus.FORBIDDEN,
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: HttpStatus.INTERNAL_SERVER_ERROR,
})*/
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ADMIN CONTROLLER

  @Post()
  //@ApiOperation({ summary: 'Create a user' })
  /*@ApiCreatedResponse({
    description: 'User created correctly',
    type: UserResponseDto,
  })*/
  async create(
    @Body() createUserRequest: UserRequestDto,
  ): Promise<UserResponseDto> {
    const userModel =
      UserDtoAdapter.fromRequestDtoToModelWithoutId(createUserRequest);
    const createdUser = await this.userService.create(userModel);
    return UserDtoAdapter.fromModelToResponseDto(createdUser);
  }

  @Put('/:userId')
  /*@ApiOperation({ summary: 'Update user' })
  @ApiNoContentResponse({
    description: 'User updated',
    type: HttpStatus.NO_CONTENT,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpStatus.NOT_FOUND,
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    //example: 'add fake uuid'
  })*/
  async updateById(
    @Param('userId') userId: string,
    @Body() data: UserRequestDto,
  ): Promise<void> {
    const updated = await this.userService.updateById(
      userId,
      UserDtoAdapter.fromRequestDtoToModelWithoutId(data),
    );
    if (!updated) {
      throw new NotFoundException(`User with id: ${userId} not found.`);
    }
  }

  @Delete('/:userId')
  /*@ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({
    description: 'User deleted',
    type: HttpStatus.NO_CONTENT,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpStatus.NOT_FOUND,
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    //example: 'add fake uuid'
  })*/
  async deleteById(@Param('userId') userId: string): Promise<void> {
    const deleted = await this.userService.deleteById(userId);
    if (!deleted) {
      throw new NotFoundException(`User with id: ${userId} not found.`);
    }
  }

  // USER CONTROLLER

  @Get('/:userId')
  /*@ApiOperation({
    summary: 'Get user',
    description: 'Get one user by id',
  })
  @ApiOkResponse({
    description: 'Return the selected user',
    type: HttpStatus.OK,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: HttpStatus.NOT_FOUND,
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    //example: 'add fake uuid'
  })*/
  async findOne(@Param('userId') userId: string): Promise<UserResponseDto> {
    const userResponse = await this.userService.findOne({
      userId,
    });

    if (!userResponse) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return UserDtoAdapter.fromModelToResponseDto(userResponse);
  }

  @Get()
  /*@ApiOperation({
    summary: 'Get all users',
  })
  @ApiOkResponse({
    description: 'Return all users',
    type: HttpStatus.OK,
  })
  @ApiNotFoundResponse({
    description: 'Users not found',
    type: HttpStatus.NOT_FOUND,
  })
  @ApiParam({
    name: 'filter',
    type: UserFilter,
    required: false,
    example: {},
  })*/
  async find(@Param('filter') filter: UserFilter): Promise<UserResponseDto[]> {
    const usersModels = await this.userService.findAll(filter);

    if (!usersModels) {
      throw new NotFoundException('Users not found');
    }

    const usersResponse = usersModels.map(
      (userModel: UserModel): UserResponseDto => {
        return UserDtoAdapter.fromModelToResponseDto(userModel);
      },
    );

    return usersResponse;
  }
}
