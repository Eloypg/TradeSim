import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionModel } from '../models/transaction.model';
import { FilterQuery, FindOptions } from '@mikro-orm/core';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionRequestDto } from '../dto/transaction-request.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { TransactionAdapter } from '../adapters/transaction.adapter';

@Controller('v1/transactions')
@ApiTags('Transactions')
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
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  async create(
    @Body() data: TransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const created = await this.transactionService.create(data);
    return TransactionAdapter.fromModelToResponseDto(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  async getAll(
    @Query('filter') filter: FilterQuery<TransactionModel>,
    @Query('options') options?: FindOptions<TransactionModel>,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionService.getAll(filter, options);
    return transactions.map((model) =>
      TransactionAdapter.fromModelToResponseDto(model),
    );
  }

  @Get(':transactionId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiOkResponse({
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiParam({ name: 'transactionId', type: String, required: true })
  async getOneById(
    @Param('transactionId', new ParseUUIDPipe()) transactionId: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.getOneById(transactionId);
    return TransactionAdapter.fromModelToResponseDto(transaction);
  }
}
