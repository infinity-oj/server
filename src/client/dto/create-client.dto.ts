import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;
}
