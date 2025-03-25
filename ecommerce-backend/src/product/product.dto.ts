import { IsString, IsArray, IsNumber, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  categoryIds: string[];

  @IsUrl()
  imageUrl: string;
}
