import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
//import { Cripto } from './cripto/entities/cripto.entity';
import { TutorialModule } from './tutorial/tutorial.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    WalletModule,
    TutorialModule,
    TransactionModule,
    //Cripto,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
