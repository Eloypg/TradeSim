import { CriptoModel } from '../../cripto/models/cripto.model';
import { TransactionModel } from '../../transaction/models/transaction.model';
import { UserModel } from '../../user/models/user.model';

export class WalletModel {
  walletId!: string;
  balance: number;
  createdAt: Date;
  updatedAt?: Date;
  user!: Pick<UserModel, 'userId'>;
  criptos?: CriptoModel[];
  transactions?: TransactionModel[];
}
