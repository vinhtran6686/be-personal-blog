import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class SeoMetadataDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsUrl()
  ogImage?: string;
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetadataDto)
  seoMetadata?: SeoMetadataDto;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
} 