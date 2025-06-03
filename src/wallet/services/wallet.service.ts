import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { WalletModel } from '../models/wallet.model';
import { FindOptions } from '@mikro-orm/core';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async getWalletById(walletId: string): Promise<WalletModel> {
    const wallet = await this.walletRepository.findOneById(walletId);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${walletId} not found`);
    }
    return wallet;
  }

  async getWalletByUserId(userId: string): Promise<WalletModel> {
    const wallet = await this.walletRepository.findOneByUserId(userId);
    if (!wallet) {
      throw new NotFoundException(`Wallet for user ${userId} not found`);
    }
    return wallet;
  }

  async getAllWallets(offset?: number, limit?: number): Promise<WalletModel[]> {
    const options: FindOptions<Wallet> = {
      offset: offset ?? 0,
      limit: limit ?? 10,
      orderBy: { balance: 'DESC' },
    };
    return this.walletRepository.findAll(options);
  }
}
