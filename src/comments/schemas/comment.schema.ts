import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Post } from '../../posts/schemas/post.schema';

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    enum: CommentStatus,
    default: CommentStatus.PENDING,
  })
  status: CommentStatus;

  @Prop({ default: null })
  moderatedBy: string;

  @Prop({ default: null })
  moderatedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment', default: null })
  parentComment: Comment;

  @Prop({ default: [] })
  likes: string[];

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  guestName: string;

  @Prop()
  guestEmail: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Add indexes for efficient querying
CommentSchema.index({ post: 1, status: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ author: 1 }); 