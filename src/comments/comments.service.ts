import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument, CommentStatus } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findAll(postId?: string, status?: CommentStatus): Promise<Comment[]> {
    const query: any = {};
    
    if (postId) {
      query.post = postId;
    }
    
    if (status) {
      query.status = status;
    }
    
    return this.commentModel
      .find(query)
      .populate('author', 'username email profile')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'username email profile')
      .populate('post', 'title slug')
      .exec();
      
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    return comment;
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const newComment = new this.commentModel(createCommentDto);
    return newComment.save();
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const existingComment = await this.commentModel.findById(id).exec();
    
    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    // Update the comment
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
      
    return updatedComment;
  }

  async moderate(id: string, status: CommentStatus, moderatorId: string): Promise<Comment> {
    const existingComment = await this.commentModel.findById(id).exec();
    
    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    // Update the comment status
    existingComment.status = status;
    existingComment.moderatedBy = moderatorId;
    existingComment.moderatedAt = new Date();
    
    return existingComment.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId, status: CommentStatus.APPROVED })
      .populate('author', 'username email profile')
      .sort({ createdAt: -1 })
      .exec();
  }

  async addLike(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    // Check if user already liked the comment
    if (comment.likes.includes(userId)) {
      throw new BadRequestException('User already liked this comment');
    }
    
    // Add user to likes array and increment like count
    comment.likes.push(userId);
    comment.likeCount = comment.likes.length;
    
    return comment.save();
  }

  async removeLike(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    // Check if user has liked the comment
    const userIndex = comment.likes.indexOf(userId);
    if (userIndex === -1) {
      throw new BadRequestException('User has not liked this comment');
    }
    
    // Remove user from likes array and update like count
    comment.likes.splice(userIndex, 1);
    comment.likeCount = comment.likes.length;
    
    return comment.save();
  }
} 