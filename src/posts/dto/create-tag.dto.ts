import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'JavaScript',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Content related to JavaScript programming language',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
} 