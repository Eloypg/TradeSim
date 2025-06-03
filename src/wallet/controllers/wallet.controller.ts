import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WalletService } from '../services/wallet.service';
import { WalletResponseDto } from '../dto/wallet-response.dto';
import { WalletAdapter } from '../adapters/wallet.adapter';
import { FindOptions } from '@mikro-orm/core';
import { Wallet } from '../entities/wallet.entity';

@Controller('v1/wallets')
@ApiTags('Wallets')
@ApiBadRequestResponse({
  description: 'Validation error',
  type: HttpStatus.BAD_REQUEST.toString(),
})
@ApiForbiddenResponse({
  description: 'Forbidden error',
  type: HttpStatus.FORBIDDEN.toString(),
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':walletId')
  @ApiOperation({ summary: 'Get wallet by wallet ID' })
  @ApiOkResponse({
    description: 'Wallet found',
    type: WalletResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiParam({ name: 'walletId', type: String, required: true })
  async getById(
    @Param('walletId', new ParseUUIDPipe()) walletId: string,
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletService.getWalletById(walletId);
    return WalletAdapter.fromModelToResponseDto(wallet);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get wallet by user ID' })
  @ApiOkResponse({
    description: 'Wallet found',
    type: WalletResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiParam({ name: 'userId', type: String, required: true })
  async getByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    return WalletAdapter.fromModelToResponseDto(wallet);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets' })
  @ApiOkResponse({
    description: 'List of wallets',
    type: [WalletResponseDto],
  })
  async getAll(
    @Query('options') options?: FindOptions<Wallet>,
  ): Promise<WalletResponseDto[]> {
    const wallets = await this.walletService.getAllWallets(
      options?.offset,
      options?.limit,
    );
    return wallets.map((wallet) =>
      WalletAdapter.fromModelToResponseDto(wallet),
    );
  }
}
