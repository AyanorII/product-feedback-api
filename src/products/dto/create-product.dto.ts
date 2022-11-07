import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory, ProductStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  upvotes: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
