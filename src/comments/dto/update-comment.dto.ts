import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { CommentStatus } from '../schemas/comment.schema';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiPropertyOptional({ 
    enum: CommentStatus, 
    description: 'Status of the comment (pending, approved, rejected)' 
  })
  @IsEnum(CommentStatus)
  @IsOptional()
  status?: CommentStatus;
} 