import { WalletModel } from 'src/wallet/models/wallet.model';

export class UserModel {
  userId!: string;

  name!: string;

  surname?: string;

  email!: string;

  password!: string;

  //remove if its unnecessary field
  wallet!: Pick<WalletModel, 'walletId'>;
}
