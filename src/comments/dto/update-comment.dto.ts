import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CommentStatus } from '../schemas/comment.schema';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  content?: string;

  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
} 