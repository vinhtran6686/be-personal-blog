import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const slug = this.generateSlug(createTagDto.name);
    
    const createdTag = new this.tagModel({
      ...createTagDto,
      slug,
    });
    
    return createdTag.save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    
    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const tag = await this.tagModel.findOne({ slug }).exec();
    
    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }
    
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    // If name is updated, generate a new slug
    let updateData = { ...updateTagDto };
    
    if (updateTagDto.name) {
      updateData.slug = this.generateSlug(updateTagDto.name);
    }
    
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    
    return updatedTag;
  }

  async remove(id: string): Promise<void> {
    const deletedTag = await this.tagModel.findByIdAndDelete(id);
    
    if (!deletedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  private generateSlug(name: string): string {
    const baseSlug = slugify(name, { lower: true, strict: true });
    return `${baseSlug}-${new Date().getTime().toString(36)}`;
  }
} 