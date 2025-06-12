/* eslint-disable @typescript-eslint/unbound-method */
import { MikroOrmWalletRepository } from '../../repositories/mikro-orm-wallet.repository';
import { EntityManager, Collection } from '@mikro-orm/core';
import { Wallet } from '../../entities/wallet.entity';
import { WalletModel } from '../../models/wallet.model';
import { WalletAdapter } from '../../adapters/wallet.adapter';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '../../../user/entities/user.entity';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { Cripto } from '../../../cripto/entities/cripto.entity';
import { Transaction } from '../../../transaction/entities/transaction.entity';
import { Test, TestingModule } from '@nestjs/testing';

describe(MikroOrmWalletRepository.name, () => {
  let repository: MikroOrmWalletRepository;
  let entityManager: MockProxy<EntityManager>;

  const wallet: Wallet = {
    walletId: '11111111-1111-1111-1111-111111111111',
    balance: 2500.75,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    user: {
      userId: '22222222-2222-2222-2222-222222222222',
      name: 'Juan',
      email: 'juan@example.com',
      password: 'hashedpassword123',
    } as User,
    criptos: new Collection<Cripto>([
      {
        criptoId: '33333333-3333-3333-3333-333333333333',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentUnitPrice: 30000.12345678,
        precision: 8,
      },
      {
        criptoId: '44444444-4444-4444-4444-444444444444',
        symbol: 'ETH',
        name: 'Ethereum',
        currentUnitPrice: 2500.87654321,
        precision: 8,
      },
    ]),
    transactions: new Collection<Transaction>([
      {
        transactionId: '55555555-5555-5555-5555-555555555555',
        type: 'BUY',
        amount: 0.5,
        criptoPricePerUnit: 30000.12345678,
        totalPriceTransaction: 15000.06172839,
        executedAt: new Date('2023-05-01T12:00:00Z'),
        cripto: {
          criptoId: '33333333-3333-3333-3333-333333333333',
          symbol: 'BTC',
        },
      },
      {
        transactionId: '66666666-6666-6666-6666-666666666666',
        type: 'SELL',
        amount: 1.2,
        criptoPricePerUnit: 2500.87654321,
        totalPriceTransaction: 3001.05185185,
        executedAt: new Date('2023-06-01T15:30:00Z'),
        cripto: {
          criptoId: '44444444-4444-4444-4444-444444444444',
          symbol: 'ETH',
        },
      },
    ]),
  };

  const walletModel: WalletModel = {
    walletId: '11111111-1111-1111-1111-111111111111',
    balance: 2500.75,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    user: {
      userId: '22222222-2222-2222-2222-222222222222',
      name: 'Juan',
      email: 'juan@example.com',
      password: 'hashedpassword123',
    } as User,
    criptos: [
      {
        criptoId: '33333333-3333-3333-3333-333333333333',
        symbol: 'BTC',
        name: 'Bitcoin',
        currentUnitPrice: 30000.12345678,
        precision: 8,
        wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
      },
      {
        criptoId: '44444444-4444-4444-4444-444444444444',
        symbol: 'ETH',
        name: 'Ethereum',
        currentUnitPrice: 2500.87654321,
        precision: 8,
        wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
      },
    ],
    transactions: [
      {
        transactionId: '55555555-5555-5555-5555-555555555555',
        type: TransactionType.BUY,
        amount: 0.5,
        criptoPricePerUnit: 30000.12345678,
        totalPriceTransaction: 15000.06172839,
        executedAt: new Date('2023-05-01T12:00:00Z'),
        cripto: {
          symbol: 'BTC',
          name: 'Bitcoin',
          currentUnitPrice: 30000.12345678,
          precision: 8,
          wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
        },
        wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
      },
      {
        transactionId: '66666666-6666-6666-6666-666666666666',
        type: TransactionType.SELL,
        amount: 1.2,
        criptoPricePerUnit: 2500.87654321,
        totalPriceTransaction: 3001.05185185,
        executedAt: new Date('2023-06-01T15:30:00Z'),
        cripto: {
          symbol: 'ETH',
          name: 'Ethereum',
          currentUnitPrice: 2500.87654321,
          precision: 8,
          wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
        },
        wallet: { walletId: '11111111-1111-1111-1111-111111111111' },
      },
    ],
  };

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

    entityManager.fork.mockReturnThis();

    jest.spyOn(WalletAdapter, 'fromEntityToModel').mockReturnValue(walletModel);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe(MikroOrmWalletRepository.prototype.findOneById.name, () => {
    it('should return WalletModel when wallet is found', async () => {
      entityManager.findOne.mockResolvedValue(wallet);

      const result = await repository.findOneById(wallet.walletId);

      expect(entityManager.findOne).toHaveBeenCalledWith(
        Wallet,
        { walletId: wallet.walletId },
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toEqual(walletModel);
    });

    it('should return null when wallet is not found', async () => {
      entityManager.findOne.mockResolvedValue(null);

      const result = await repository.findOneById(wallet.walletId);

      expect(entityManager.findOne).toHaveBeenCalledWith(
        Wallet,
        { walletId: wallet.walletId },
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toBeNull();
    });
  });

  describe(MikroOrmWalletRepository.prototype.findOneByUserId.name, () => {
    it('should return WalletModel when wallet is found by userId', async () => {
      entityManager.findOne.mockResolvedValue(wallet);

      const result = await repository.findOneByUserId(wallet.user.userId);

      expect(entityManager.findOne).toHaveBeenCalledWith(
        Wallet,
        { user: { userId: wallet.user.userId } },
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toEqual(walletModel);
    });

    it('should return null when no wallet found by userId', async () => {
      entityManager.findOne.mockResolvedValue(null);

      const result = await repository.findOneByUserId(wallet.user.userId);

      expect(entityManager.findOne).toHaveBeenCalledWith(
        Wallet,
        { user: { userId: wallet.user.userId } },
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toBeNull();
    });
  });

  describe(MikroOrmWalletRepository.prototype.findAll.name, () => {
    it('should return an array of WalletModel', async () => {
      entityManager.find.mockResolvedValue([wallet]);

      const result = await repository.findAll();

      expect(entityManager.find).toHaveBeenCalledWith(
        Wallet,
        {},
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toEqual([walletModel]);
    });

    it('should return empty array if no wallets found', async () => {
      entityManager.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(entityManager.find).toHaveBeenCalledWith(
        Wallet,
        {},
        { populate: ['criptos', 'transactions'] },
      );
      expect(result).toEqual([]);
    });
  });
});
