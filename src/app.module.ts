import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { Tutorial } from './tutorial/entities/tutorial.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { Cripto } from './cripto/entities/cripto.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    WalletModule,
    Tutorial,
    Transaction,
    Cripto,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
