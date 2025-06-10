import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from '../../controllers/wallet.controller';
import { mock, MockProxy } from 'jest-mock-extended';
import { WalletService } from '../../services/wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: MockProxy<WalletService>;

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

  // Add more test cases here based on the controller methods
}); 