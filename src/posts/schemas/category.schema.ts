import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: null })
  parentCategory: string;

  @Prop({ default: 0 })
  postCount: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: null })
  imageUrl: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Add indexes for efficient querying
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ featured: 1 }); 