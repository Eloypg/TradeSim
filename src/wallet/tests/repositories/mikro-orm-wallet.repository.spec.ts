import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmWalletRepository } from '../../repositories/mikro-orm-wallet.repository';
import { EntityManager } from '@mikro-orm/core';
import { mock, MockProxy } from 'jest-mock-extended';
import { Wallet } from '../../entities/wallet.entity';

describe('MikroOrmWalletRepository', () => {
  let repository: MikroOrmWalletRepository;
  let entityManager: MockProxy<EntityManager>;

  beforeEach(async () => {
    entityManager = mock<EntityManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MikroOrmWalletRepository,
        {
          provide: EntityManager,
          useValue: entityManager,
        },
      ],
    }).compile();

    repository = module.get<MikroOrmWalletRepository>(MikroOrmWalletRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // Add more test cases here based on the repository methods
}); 