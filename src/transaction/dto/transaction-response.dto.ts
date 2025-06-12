import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../common/enums/transaction-type.enum';

class WalletReferenceResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  walletId: string;
}

export class CriptoReferenceResponseDto {
  @ApiProperty({ example: 'BTC' })
  symbol: string;

  @ApiProperty({ example: 'Bitcoin' })
  name: string;

  @ApiProperty({ example: 8 })
  precision: number;

  @ApiProperty({ example: 45000.75 })
  currentUnitPrice: number;
}
export class TransactionResponseDto {
  @ApiProperty({ enum: TransactionType, example: TransactionType.BUY })
  type: TransactionType;

  @ApiProperty({ example: 1.5 })
  amount: number;

  @ApiProperty({ example: 45000.75 })
  criptoPricePerUnit: number;

  @ApiProperty({ example: 67500.0 })
  totalPriceTransaction: number;

  @ApiProperty({ example: '2024-06-03T15:30:00Z' })
  executedAt: Date;

  @ApiProperty({ type: () => WalletReferenceResponseDto })
  wallet: WalletReferenceResponseDto;

  @ApiProperty({ type: () => CriptoReferenceResponseDto })
  cripto: CriptoReferenceResponseDto;
}
