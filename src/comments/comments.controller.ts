import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentStatus } from './schemas/comment.schema';

@ApiTags('comments')
@Controller('api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({ name: 'postId', required: false, description: 'Filter by post ID' })
  @ApiQuery({ name: 'status', required: false, enum: CommentStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Returns all comments based on filters' })
  async findAll(
    @Query('postId') postId?: string,
    @Query('status') status?: CommentStatus,
  ) {
    return this.commentsService.findAll(postId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Put(':id/moderate')
  @ApiOperation({ summary: 'Moderate a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment moderated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async moderate(
    @Param('id') id: string,
    @Body('status') status: CommentStatus,
    @Body('moderatorId') moderatorId: string,
  ) {
    return this.commentsService.moderate(id, status, moderatorId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(id);
    return { message: 'Comment deleted successfully' };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment liked successfully' })
  @ApiResponse({ status: 400, description: 'Already liked or invalid input' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async addLike(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.commentsService.addLike(id, userId);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Remove like from a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  @ApiResponse({ status: 400, description: 'Not liked or invalid input' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async removeLike(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.commentsService.removeLike(id, userId);
  }
} 