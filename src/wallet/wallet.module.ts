import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { User } from 'src/user/entities/user.entity';
import { Cripto } from 'src/cripto/entities/cripto.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { WalletRepository } from './repositories/wallet.repository';
import { MikroOrmWalletRepository } from './repositories/mikro-orm-wallet.repository';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, User, Cripto, Transaction])],
  controllers: [WalletController],
  providers: [
    WalletService,
    {
      provide: WalletRepository,
      useClass: MikroOrmWalletRepository,
    },
  ],
  exports: [WalletService],
})
export class WalletModule {}
