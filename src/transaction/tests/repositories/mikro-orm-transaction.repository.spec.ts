/* eslint-disable @typescript-eslint/unbound-method */
import { EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { mock, MockProxy } from 'jest-mock-extended';
import { TransactionType } from '../../../common/enums/transaction-type.enum';
import { Cripto } from '../../../cripto/entities/cripto.entity';
import { TransactionAdapter } from '../../adapters/transaction.adapter';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionModel } from '../../models/transaction.model';
import { MikroOrmTransactionRepository } from '../../repositories/mikro-orm-transaction.repository';
import { Wallet } from '../../../wallet/entities/wallet.entity';

describe(MikroOrmTransactionRepository.name, () => {
  let repository: MikroOrmTransactionRepository;
  let em: MockProxy<EntityManager>;

  const transactionId = randomUUID();
  const criptoId = randomUUID();
  const walletId = randomUUID();

  const transactionEntity: Transaction = {
    transactionId,
    type: TransactionType.BUY,
    amount: 0.5,
    criptoPricePerUnit: 30000.12345678,
    totalPriceTransaction: 15000.06172839,
    executedAt: new Date('2023-05-01T12:00:00Z'),
    wallet: {
      walletId,
    } as Wallet,
    cripto: {
      criptoId,
      name: 'Bitcoin',
      precision: 10,
      currentUnitPrice: 100000,
      wallet: {
        walletId,
      } as Wallet,
      symbol: 'BTC',
    },
  };

  const transactionModel: TransactionModel = {
    transactionId,
    type: TransactionType.BUY,
    amount: 0.5,
    criptoPricePerUnit: 30000.12345678,
    totalPriceTransaction: 15000.06172839,
    executedAt: new Date('2023-05-01T12:00:00Z'),
    wallet: {
      walletId,
    } as Wallet,
    cripto: {
      name: 'Bitcoin',
      precision: 10,
      currentUnitPrice: 100000,
      wallet: {
        walletId,
      } as Wallet,
      symbol: 'BTC',
    },
  };

  beforeEach(async () => {
    em = mock<EntityManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MikroOrmTransactionRepository,
        {
          provide: EntityManager,
          useValue: em,
        },
      ],
    }).compile();

    repository = module.get<MikroOrmTransactionRepository>(
      MikroOrmTransactionRepository,
    );

    em.fork.mockReturnThis();

    jest
      .spyOn(TransactionAdapter, 'fromEntityToModel')
      .mockReturnValue(transactionModel);
  });

  describe(MikroOrmTransactionRepository.prototype.insert.name, () => {
    it('should insert a transaction with new cripto and return the model', async () => {
      const wallet = { walletId } as Wallet;
      const criptoEntity: Cripto = {
        criptoId,
        name: 'Bitcoin',
        precision: 10,
        currentUnitPrice: 100000,
        wallet,
        symbol: 'BTC',
      };

      const modelWithoutId = {
        type: TransactionType.BUY,
        amount: 0.5,
        criptoPricePerUnit: 30000.12345678,
        totalPriceTransaction: 15000.06172839,
        wallet,
        cripto: {
          name: 'Bitcoin',
          precision: 10,
          currentUnitPrice: 100000,
          wallet,
          symbol: 'BTC',
        },
      };

      em.findOne.mockResolvedValue(wallet);
      em.create
        .mockReturnValueOnce(criptoEntity)
        .mockReturnValueOnce(transactionEntity);

      const result = await repository.insert(modelWithoutId);

      expect(em.findOne).toHaveBeenCalledWith(Wallet, {
        walletId: modelWithoutId.wallet.walletId,
      });
      expect(em.create).toHaveBeenCalledTimes(2);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(2);
      expect(result).toEqual(transactionModel);
    });

    it('should throw NotFoundException if wallet does not exist', async () => {
      em.findOne.mockResolvedValue(null);

      const modelWithoutId = {
        type: TransactionType.BUY,
        amount: 0.5,
        criptoPricePerUnit: 30000.12345678,
        totalPriceTransaction: 15000.06172839,
        wallet: {
          walletId,
        },
        cripto: {
          name: 'Bitcoin',
          precision: 10,
          currentUnitPrice: 100000,
          wallet: {
            walletId,
          },
          symbol: 'BTC',
        },
      };

      await expect(repository.insert(modelWithoutId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(MikroOrmTransactionRepository.prototype.findAll.name, () => {
    it('should return all transactions as models', async () => {
      em.find.mockResolvedValue([transactionEntity]);

      const result = await repository.findAll({});

      expect(em.find).toHaveBeenCalledWith(
        Transaction,
        {},
        expect.objectContaining({ populate: ['cripto', 'wallet'] }),
      );
      expect(result).toEqual([transactionModel]);
    });
  });

  describe(MikroOrmTransactionRepository.prototype.findOneById.name, () => {
    it('should return a transaction model by id', async () => {
      em.findOne.mockResolvedValue(transactionEntity);

      const result = await repository.findOneById(transactionId);

      expect(em.findOne).toHaveBeenCalledWith(
        Transaction,
        { transactionId },
        expect.objectContaining({ populate: ['cripto', 'wallet'] }),
      );
      expect(result).toEqual(transactionModel);
    });

    it('should return null if transaction not found', async () => {
      em.findOne.mockResolvedValue(null);

      const result = await repository.findOneById(transactionId);

      expect(result).toBeNull();
    });
  });
});
