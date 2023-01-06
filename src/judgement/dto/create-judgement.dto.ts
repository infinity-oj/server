import { IsOptional, IsString } from 'class-validator';

export class CreateJudgementDto {}

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
