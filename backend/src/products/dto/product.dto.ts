import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsNumber() @Type(() => Number) price: number;
  @IsString() image: string;
  @IsArray() @IsString({ each: true }) @IsOptional() images?: string[];
  @IsString() category: string;
  @IsNumber() @Min(0) @Type(() => Number) stock: number;
  @IsBoolean() @IsOptional() featured?: boolean;
  @IsString() @IsOptional() badge?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() features?: string[];
}

export class UpdateProductDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @Type(() => Number) @IsOptional() price?: number;
  @IsString() @IsOptional() image?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() images?: string[];
  @IsString() @IsOptional() category?: string;
  @IsNumber() @Min(0) @Type(() => Number) @IsOptional() stock?: number;
  @IsBoolean() @IsOptional() featured?: boolean;
  @IsString() @IsOptional() badge?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() features?: string[];
}
