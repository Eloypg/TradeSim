/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CriptoModel } from '../../cripto/models/cripto.model';
import { TransactionModel } from '../../transaction/models/transaction.model';
import { UserModel } from '../../user/models/user.model';

export class WalletResponseDto {
  @ApiProperty({ example: 1500.75 })
  @IsNumber({ maxDecimalPlaces: 2 })
  balance!: number;

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  createdAt!: Date;

  @ApiProperty({ type: () => UserModel })
  @ValidateNested()
  @Type(() => UserModel)
  user!: Pick<UserModel, 'userId'>;

  @ApiProperty({ type: [CriptoModel], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CriptoModel)
  criptos?: CriptoModel[];

  @ApiProperty({ type: [TransactionModel], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TransactionModel)
  transactions?: TransactionModel[];
}
