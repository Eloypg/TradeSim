/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../controllers/transaction.controller';
import { TransactionService } from '../../services/transaction.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { TransactionAdapter } from '../../adapters/transaction.adapter';
import { TransactionModel } from '../../models/transaction.model';
import { TransactionRequestDto } from '../../dto/transaction-request.dto';
import { TransactionResponseDto } from '../../dto/transaction-response.dto';
import { Wallet } from '../../../wallet/entities/wallet.entity';
import { randomUUID } from 'crypto';

describe(TransactionController.name, () => {
  let controller: TransactionController;
  let service: MockProxy<TransactionService>;

  const transactionId = randomUUID();
  const walletId = randomUUID();

  const transactionModel: TransactionModel = {
    transactionId,
    type: TransactionType.BUY,
    amount: 1.5,
    criptoPricePerUnit: 45000.75,
    totalPriceTransaction: 67500.0,
    executedAt: new Date('2024-06-03T15:30:00Z'),
    wallet: {
      walletId,
    } as Wallet,
    cripto: {
      symbol: 'BTC',
      name: 'Bitcoin',
      precision: 8,
      currentUnitPrice: 45000.75,
      wallet: {
        walletId,
      } as Wallet,
    },
  };

  const transactionResponseDto: TransactionResponseDto = {
    type: TransactionType.BUY,
    amount: 1.5,
    criptoPricePerUnit: 45000.75,
    totalPriceTransaction: 67500.0,
    executedAt: new Date('2024-06-03T15:30:00Z'),
    wallet: {
      walletId,
    },
    cripto: {
      symbol: 'BTC',
      name: 'Bitcoin',
      precision: 8,
      currentUnitPrice: 45000.75,
    },
  };

  beforeEach(async () => {
    service = mock<TransactionService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);

    jest
      .spyOn(TransactionAdapter, 'fromModelToResponseDto')
      .mockReturnValue(transactionResponseDto);
  });

  describe(TransactionController.prototype.create.name, () => {
    it('should create a transaction and return response DTO', async () => {
      service.create.mockResolvedValue(transactionModel);

      const requestDto: TransactionRequestDto = {
        type: TransactionType.BUY,
        amount: 1.5,
        criptoPricePerUnit: 45000.75,
        totalPriceTransaction: 67500.0,
        wallet: { walletId },
        cripto: {
          symbol: 'BTC',
          name: 'Bitcoin',
          precision: 8,
          currentUnitPrice: 45000.75,
          wallet: { walletId },
        },
      };

      const result = await controller.create(requestDto);

      expect(service.create).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(transactionResponseDto);
    });
  });

  describe(TransactionController.prototype.getAll.name, () => {
    it('should return all transactions as response DTOs', async () => {
      service.getAll.mockResolvedValue([transactionModel]);

      const result = await controller.getAll({});

      expect(service.getAll).toHaveBeenCalledWith({}, undefined);
      expect(result).toEqual([transactionResponseDto]);
    });
  });

  describe(TransactionController.prototype.getOneById.name, () => {
    it('should return a transaction by ID as response DTO', async () => {
      service.getOneById.mockResolvedValue(transactionModel);

      const result = await controller.getOneById(transactionId);

      expect(service.getOneById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(transactionResponseDto);
    });
  });
});
