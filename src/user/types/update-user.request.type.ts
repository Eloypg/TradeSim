import { UserModel } from '../models/user.model';

export type UpdateUserRequest = Partial<Omit<UserModel, 'userId' | 'wallet'>>;
