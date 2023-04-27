import { SlotValue } from '@/interpreter/slots';
import { IsOptional, IsString } from 'class-validator';

export class CreateJudgementDto {
  @IsString()
  clientToken: string;

  @IsString()
  program: string;

  inputs?: Array<SlotValue>;
}

export class CreateTraditionalJudgementDto {
  @IsString()
  clientToken: string;

  @IsString()
  @IsOptional()
  publicVolume?: string;

  @IsString()
  @IsOptional()
  privateVolume?: string;

  @IsString()
  @IsOptional()
  userVolume?: string;
}
