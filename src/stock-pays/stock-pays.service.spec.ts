import { Test, TestingModule } from '@nestjs/testing';
import { StockPaysService } from './stock-pays.service';

describe('StockPaysService', () => {
  let service: StockPaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPaysService],
    }).compile();

    service = module.get<StockPaysService>(StockPaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
