import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { MikroOrmUserRepository } from './repositories/mikro-orm-user.repository';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: MikroOrmUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
