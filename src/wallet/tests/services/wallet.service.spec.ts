/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../../services/wallet.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { WalletRepository } from '../../repositories/wallet.repository';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { User } from '../../../user/entities/user.entity';
import { WalletModel } from '../../../wallet/models/wallet.model';
import { NotFoundException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let repository: MockProxy<WalletRepository>;

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
    repository = mock<WalletRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: WalletRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(WalletService.prototype.getWalletById.name, () => {
    it('should return WalletModel when wallet exists', async () => {
      repository.findOneById.mockResolvedValue(walletModel);

      const result = await service.getWalletById(walletModel.walletId);

      expect(repository.findOneById).toHaveBeenCalledWith(walletModel.walletId);
      expect(result).toEqual(walletModel);
    });

    it('should throw NotFoundException when wallet does not exist', async () => {
      repository.findOneById.mockResolvedValue(null);

      await expect(service.getWalletById(walletModel.walletId)).rejects.toThrow(
        new NotFoundException(
          `Wallet with ID ${walletModel.walletId} not found`,
        ),
      );
      expect(repository.findOneById).toHaveBeenCalledWith(walletModel.walletId);
    });
  });

  describe(WalletService.prototype.getWalletByUserId.name, () => {
    it('should return WalletModel when wallet exists for user', async () => {
      repository.findOneByUserId.mockResolvedValue(walletModel);

      const result = await service.getWalletByUserId(walletModel.user.userId);

      expect(repository.findOneByUserId).toHaveBeenCalledWith(
        walletModel.user.userId,
      );
      expect(result).toEqual(walletModel);
    });

    it('should throw NotFoundException when wallet does not exist for user', async () => {
      repository.findOneByUserId.mockResolvedValue(null);

      await expect(
        service.getWalletByUserId(walletModel.user.userId),
      ).rejects.toThrow(
        new NotFoundException(
          `Wallet for user ${walletModel.user.userId} not found`,
        ),
      );
      expect(repository.findOneByUserId).toHaveBeenCalledWith(
        walletModel.user.userId,
      );
    });
  });

  describe(WalletService.prototype.getAllWallets.name, () => {
    it('should return wallets with default pagination', async () => {
      repository.findAll.mockResolvedValue([walletModel]);

      const result = await service.getAllWallets();

      expect(repository.findAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
        orderBy: { balance: 'DESC' },
      });
      expect(result).toEqual([walletModel]);
    });

    it('should return wallets with provided offset and limit', async () => {
      repository.findAll.mockResolvedValue([walletModel]);

      const result = await service.getAllWallets(5, 20);

      expect(repository.findAll).toHaveBeenCalledWith({
        offset: 5,
        limit: 20,
        orderBy: { balance: 'DESC' },
      });
      expect(result).toEqual([walletModel]);
    });
  });
});
