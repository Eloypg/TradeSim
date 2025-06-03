import { WalletModel } from '../../wallet/models/wallet.model';

export class CriptoModel {
  criptoId: string;
  symbol: string;
  name: string;
  precision: number;
  currentUnitPrice: number;
  wallet: Pick<WalletModel, 'walletId'>;
}
