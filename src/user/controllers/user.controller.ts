import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserDtoAdapter } from '../adapters/user-dto.adapter';

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
}
