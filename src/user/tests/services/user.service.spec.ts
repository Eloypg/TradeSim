import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { MikroOrmUserRepository } from '../../repositories/mikro-orm-user.repository';
import { User } from '../../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: MockProxy<MikroOrmUserRepository>;

  beforeEach(async () => {
    repository = mock<MikroOrmUserRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MikroOrmUserRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more test cases here based on the service methods
});
