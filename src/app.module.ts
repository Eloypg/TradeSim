import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [UserModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
