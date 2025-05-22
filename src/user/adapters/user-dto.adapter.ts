import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserModel } from '../models/user.model';

export class UserDtoAdapter {
  static fromRequestDtoToModelWithoutId(
    request: UserRequestDto,
  ): Omit<UserModel, 'userId' | 'wallet'> {
    const userModel: Omit<UserModel, 'userId' | 'wallet'> = new UserModel();
    userModel.name = request.name;
    userModel.surname = request.surname;
    userModel.email = request.email;
    userModel.password = request.password;
    return userModel;
  }

  static fromModelToResponseDto(model: UserModel): UserResponseDto {
    const response = new UserResponseDto();
    response.name = model.name;
    response.surname = model.surname;
    response.email = model.email;
    return response;
  }
}
