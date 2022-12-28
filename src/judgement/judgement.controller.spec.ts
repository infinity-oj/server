import { Test, TestingModule } from '@nestjs/testing';
import { JudgementController } from './judgement.controller';
import { JudgementService } from './judgement.service';

describe('JudgementController', () => {
  let controller: JudgementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JudgementController],
      providers: [JudgementService],
    }).compile();

    controller = module.get<JudgementController>(JudgementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
