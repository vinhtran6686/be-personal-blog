import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ default: [] })
  categories: string[];

  @Prop({ default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object, default: {} })
  seoMetadata: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };

  @Prop({ default: false })
  published: boolean;

  @Prop()
  publishedAt: Date;

  @Prop({ type: [Object], default: [] })
  revisions: Array<{
    content: string;
    updatedAt: Date;
    updatedBy: string;
  }>;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ default: false })
  featured: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add text indexes for search functionality
PostSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  {
    weights: {
      title: 10,
      content: 5,
      tags: 3,
    },
    name: 'post_text_search',
  },
);

// Add index for slug for faster lookups
PostSchema.index({ slug: 1 }, { unique: true });

// Add compound index for category and tag filtering
PostSchema.index({ categories: 1, tags: 1 });

// Add index for published status and date for faster listing
PostSchema.index({ published: 1, publishedAt: -1 }); 