import { User } from '../entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserAdapter {
  static fromModelToEntity(model: UserModel): User {
    const entity = new User();
    entity.userId = model.userId;
    entity.name = model.name;
    entity.surname1 = model.surname1;
    entity.email = model.email;
    entity.password = model.password;
    entity.wallet = model.wallet;
    return entity;
  }

  static fromEntityToModel(entity: User): UserModel {
    const model = new UserModel();
    model.userId = entity.userId;
    model.name = entity.name;
    model.surname1 = entity.surname1;
    model.email = entity.email;
    model.password = entity.password;
    model.wallet = entity.wallet;
    return model;
  }
}
