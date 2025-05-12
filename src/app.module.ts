import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), UserModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
