import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tutorial } from './entities/tutorial.entity';
import { TutorialController } from './controllers/tutorial.controller';
import { TutorialRepository } from './repositories/tutorial.repository';
import { MikroOrmTutorialRepository } from './repositories/mikro-orm-tutorial.repository';
import { TutorialService } from './services/tutorial.service';

@Module({
  imports: [MikroOrmModule.forFeature([Tutorial])],
  controllers: [TutorialController],
  providers: [
    TutorialService,
    {
      provide: TutorialRepository,
      useClass: MikroOrmTutorialRepository,
    },
  ],
  exports: [TutorialService],
})
export class TutorialModule {}
