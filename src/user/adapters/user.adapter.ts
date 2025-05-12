import { User } from '../entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserAdapter {
  static fromEntityToModel(entity: User): UserModel {
    const model = new UserModel();
    model.userId = entity.userId;
    model.name = entity.name;
    model.surname = entity.surname;
    model.email = entity.email;
    model.password = entity.password;
    model.wallet = entity.wallet;
    return model;
  }
}
