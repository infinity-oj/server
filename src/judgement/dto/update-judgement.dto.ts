import { PartialType } from '@nestjs/mapped-types';
import { CreateJudgementDto } from './create-judgement.dto';

export class UpdateJudgementDto extends PartialType(CreateJudgementDto) {}
