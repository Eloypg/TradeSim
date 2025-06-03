import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
  IsUUID,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

class WalletReferenceDto {
  @ApiProperty({
    required: true,
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  walletId: string;
}

export class CriptoReferenceRequestDto {
  @ApiProperty({ required: true, example: 'BTC' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ required: true, example: 'Bitcoin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: 8 })
  @IsNumber()
  @IsPositive()
  precision: number;

  @ApiProperty({ required: true, example: 45000.75 })
  @IsNumber()
  @IsPositive()
  currentUnitPrice: number;

  @ApiProperty({ required: true, type: () => WalletReferenceDto })
  @ValidateNested()
  @Type(() => WalletReferenceDto)
  wallet: WalletReferenceDto;
}

export class TransactionRequestDto {
  @ApiProperty({ required: true, enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ required: true, example: 1.5 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ required: true, example: 45000.75 })
  @IsNumber()
  @IsPositive()
  criptoPricePerUnit: number;

  @ApiProperty({ required: true, example: 67500.0 })
  @IsNumber()
  @IsPositive()
  totalPriceTransaction: number;

  @ApiProperty({ required: true, type: () => WalletReferenceDto })
  @ValidateNested()
  @Type(() => WalletReferenceDto)
  wallet: WalletReferenceDto;

  @ApiProperty({ required: true, type: () => CriptoReferenceRequestDto })
  @ValidateNested()
  @Type(() => CriptoReferenceRequestDto)
  cripto: CriptoReferenceRequestDto;
}
