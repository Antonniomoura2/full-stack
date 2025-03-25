import { IsArray, IsNumber, IsDate } from 'class-validator';

export class CreateOrderDto {
  @IsDate()
  date: Date;

  @IsArray()
  productIds: string[];

  @IsNumber()
  total: number;
}
