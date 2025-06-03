import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { CriptoModel } from 'src/cripto/models/cripto.model';
import { WalletModel } from 'src/wallet/models/wallet.model';

export class TransactionModel {
  transactionId: string;
  type: TransactionType;
  amount: number;
  criptoPricePerUnit: number;
  totalPriceTransaction: number;
  executedAt: Date;
  wallet: Pick<WalletModel, 'walletId'>;
  cripto: Omit<CriptoModel, 'criptoId'>;
}
