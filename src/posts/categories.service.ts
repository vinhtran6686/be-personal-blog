import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = this.generateSlug(createCategoryDto.name);
    
    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      slug,
    });
    
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // If name is updated, generate a new slug
    let updateData = { ...updateCategoryDto };
    
    if (updateCategoryDto.name) {
      updateData.slug = this.generateSlug(updateCategoryDto.name);
    }
    
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
      
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  private generateSlug(name: string): string {
    const baseSlug = slugify(name, { lower: true, strict: true });
    return `${baseSlug}-${new Date().getTime().toString(36)}`;
  }
} 