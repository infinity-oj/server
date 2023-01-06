import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class SlotDef {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

class LinkDef {
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;
}

class ProgramRef {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({}, { each: true })
  inputs: Array<number>;

  @IsNumber({}, { each: true })
  outputs: Array<number>;
}

class SlotsDef {
  @IsArray()
  slots: Array<SlotDef>;
}

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => SlotsDef)
  inputs: SlotsDef;

  @ValidateNested()
  @Type(() => SlotsDef)
  outputs: SlotsDef;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramRef)
  programs: Array<ProgramRef>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDef)
  links: Array<LinkDef>;
}
