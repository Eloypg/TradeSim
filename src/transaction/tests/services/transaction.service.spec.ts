/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';
import { TransactionService } from '../../services/transaction.service';
import { TransactionRepository } from '../../repositories/transaction.repository';
import { TransactionModel } from '../../models/transaction.model';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { randomUUID } from 'crypto';
import { Wallet } from '../../../wallet/entities/wallet.entity';

describe(TransactionService.name, () => {
  let service: TransactionService;
  let repository: MockProxy<TransactionRepository>;

  const transactionId = randomUUID();
  const walletId = randomUUID();

  const transactionModel: TransactionModel = {
    transactionId,
    type: TransactionType.BUY,
    amount: 1.5,
    criptoPricePerUnit: 20000,
    totalPriceTransaction: 30000,
    executedAt: new Date('2023-01-01T00:00:00Z'),
    wallet: {
      walletId,
    } as Wallet,
    cripto: {
      name: 'ETH',
      symbol: 'ETH',
      precision: 8,
      currentUnitPrice: 20000,
      wallet: {
        walletId,
      } as Wallet,
    },
  };

  beforeEach(async () => {
    repository = mock<TransactionRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(TransactionService.prototype.create.name, () => {
    it('should call repository.insert and return created transaction', async () => {
      repository.insert.mockResolvedValue(transactionModel);

      const data = {
        type: TransactionType.BUY,
        amount: 1.5,
        criptoPricePerUnit: 20000,
        totalPriceTransaction: 30000,
        wallet: { walletId } as Wallet,
        cripto: {
          name: 'ETH',
          symbol: 'ETH',
          precision: 8,
          currentUnitPrice: 20000,
          wallet: { walletId } as Wallet,
        },
      };

      const result = await service.create(data);

      expect(repository.insert).toHaveBeenCalledWith(data);
      expect(result).toEqual(transactionModel);
    });
  });

  describe(TransactionService.prototype.getAll.name, () => {
    it('should return all transactions from repository', async () => {
      repository.findAll.mockResolvedValue([transactionModel]);

      const result = await service.getAll({});

      expect(repository.findAll).toHaveBeenCalledWith({}, undefined);
      expect(result).toEqual([transactionModel]);
    });
  });

  describe(TransactionService.prototype.getOneById.name, () => {
    it('should return transaction if found', async () => {
      repository.findOneById.mockResolvedValue(transactionModel);

      const result = await service.getOneById(transactionId);

      expect(repository.findOneById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(transactionModel);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      repository.findOneById.mockResolvedValue(null);

      await expect(service.getOneById(transactionId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
