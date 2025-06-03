import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Cripto } from '../cripto/entities/cripto.entity';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { MikroOrmTransactionRepository } from './repositories/mikro-orm-transaction.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Transaction, Wallet, Cripto])],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: TransactionRepository,
      useClass: MikroOrmTransactionRepository,
    },
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
