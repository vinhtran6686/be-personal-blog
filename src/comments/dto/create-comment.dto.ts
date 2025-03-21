import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The post ID this comment belongs to' })
  @IsMongoId()
  @IsNotEmpty()
  post: string;

  @ApiPropertyOptional({ description: 'The user ID of the comment author (if authenticated)' })
  @IsMongoId()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({ description: 'Parent comment ID for threaded comments' })
  @IsMongoId()
  @IsOptional()
  parentComment?: string;

  // For guest comments
  @ApiPropertyOptional({ description: 'Guest name for unauthenticated comments' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  guestName?: string;

  @ApiPropertyOptional({ description: 'Guest email for unauthenticated comments' })
  @IsEmail()
  @IsOptional()
  guestEmail?: string;
} 