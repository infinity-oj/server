import { Test, TestingModule } from '@nestjs/testing';
import { JudgementService } from './judgement.service';

describe('JudgementService', () => {
  let service: JudgementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JudgementService],
    }).compile();

    service = module.get<JudgementService>(JudgementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
