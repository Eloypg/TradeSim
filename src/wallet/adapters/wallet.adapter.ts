import { CriptoModel } from 'src/cripto/models/cripto.model';
import { Wallet } from '../entities/wallet.entity';
import { WalletModel } from '../models/wallet.model';
import { Cripto } from 'src/cripto/entities/cripto.entity';
import { CriptoAdapter } from 'src/cripto/adapters/cripto.adapter';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionModel } from 'src/transaction/models/transaction.model';
import { TransactionAdapter } from 'src/transaction/adapters/transaction.adapter';
import { WalletResponseDto } from '../dto/wallet-response.dto';

export class WalletAdapter {
  static fromEntityToModel(entity: Wallet): WalletModel {
    const model = new WalletModel();
    model.walletId = entity.walletId;
    model.balance = entity.balance;
    model.createdAt = entity.createdAt;
    model.user = entity.user;
    model.criptos = entity.criptos?.map(
      (cripto: Cripto): CriptoModel => CriptoAdapter.fromEntityToModel(cripto),
    );
    model.transactions = entity.transactions?.map(
      (transaction: Transaction): TransactionModel =>
        TransactionAdapter.fromEntityToModel(transaction),
    );
    return model;
  }
  static fromModelToResponseDto(model: WalletModel): WalletResponseDto {
    const response = new WalletResponseDto();
    response.balance = model.balance;
    response.createdAt = model.createdAt;
    response.user = model.user;
    response.criptos = model.criptos ?? [];
    response.transactions = model.transactions ?? [];
    return response;
  }
}
