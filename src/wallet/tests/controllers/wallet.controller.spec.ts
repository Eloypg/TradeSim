/* eslint-disable @typescript-eslint/unbound-method */
import { WalletController } from '../../controllers/wallet.controller';
import { WalletService } from '../../services/wallet.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { WalletAdapter } from '../../adapters/wallet.adapter';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { User } from '../../../user/entities/user.entity';
import { WalletModel } from '../../../wallet/models/wallet.model';
import { Test, TestingModule } from '@nestjs/testing';

describe(WalletController.name, () => {
  let controller: WalletController;
  let service: MockProxy<WalletService>;

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
    service = mock<WalletService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(WalletController.prototype.getById.name, () => {
    it('should return WalletResponseDto when wallet found by ID', async () => {
      service.getWalletById.mockResolvedValue(walletModel);

      const result = await controller.getById(walletModel.walletId);

      expect(service.getWalletById).toHaveBeenCalledWith(walletModel.walletId);
      expect(result).toEqual(WalletAdapter.fromModelToResponseDto(walletModel));
    });
  });

  describe(WalletController.prototype.getByUserId.name, () => {
    it('should return WalletResponseDto when wallet found by user ID', async () => {
      service.getWalletByUserId.mockResolvedValue(walletModel);

      const result = await controller.getByUserId(walletModel.user.userId);

      expect(service.getWalletByUserId).toHaveBeenCalledWith(
        walletModel.user.userId,
      );
      expect(result).toEqual(WalletAdapter.fromModelToResponseDto(walletModel));
    });
  });

  describe(WalletController.prototype.getAll.name, () => {
    it('should return array of WalletResponseDto', async () => {
      service.getAllWallets.mockResolvedValue([walletModel]);

      const result = await controller.getAll();

      expect(service.getAllWallets).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual([
        WalletAdapter.fromModelToResponseDto(walletModel),
      ]);
    });

    it('should return paginated array of WalletResponseDto with options', async () => {
      service.getAllWallets.mockResolvedValue([walletModel]);

      const result = await controller.getAll({ offset: 5, limit: 20 });

      expect(service.getAllWallets).toHaveBeenCalledWith(5, 20);
      expect(result).toEqual([
        WalletAdapter.fromModelToResponseDto(walletModel),
      ]);
    });
  });
});
