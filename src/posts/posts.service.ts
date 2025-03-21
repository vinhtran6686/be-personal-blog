import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const slug = this.generateSlug(createPostDto.title);
    
    const createdPost = new this.postModel({
      ...createPostDto,
      author: authorId,
      slug,
      revisions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return createdPost.save();
  }

  async findAll(query: any): Promise<Post[]> {
    const {
      published,
      category,
      tag,
      limit = 10,
      page = 1,
      sort = '-createdAt',
    } = query;

    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    if (published !== undefined) {
      filter.published = published === 'true';
    }
    
    if (category) {
      filter.categories = category;
    }
    
    if (tag) {
      filter.tags = tag;
    }
    
    return this.postModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'username email')
      .populate('categories')
      .populate('tags')
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'username email')
      .populate('categories')
      .populate('tags')
      .exec();
      
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ slug })
      .populate('author', 'username email')
      .populate('categories')
      .populate('tags')
      .exec();
      
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.findOne(id);
    
    // Verify ownership
    if (post.author.toString() !== userId) {
      throw new UnauthorizedException('You can only update your own posts');
    }
    
    // If the title is updated, generate a new slug
    let slug = post.slug;
    if (updatePostDto.title) {
      slug = this.generateSlug(updatePostDto.title);
    }
    
    // Create a revision of the current post state
    const revision = {
      content: post.content,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    
    // Add revision to the array if we're tracking revisions
    // For this implementation, we need to make sure the post schema has a revisions field
    const currentRevisions = post.revisions || [];
    
    // Handle published status change
    let publishedAt = post.publishedAt;
    if (updatePostDto.published && !post.published) {
      // If publishing for the first time
      publishedAt = new Date();
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePostDto,
          slug,
          revisions: [...currentRevisions, revision],
          updatedAt: new Date(),
          publishedAt,
        },
        { new: true }
      )
      .populate('author', 'username email')
      .populate('categories')
      .populate('tags')
      .exec();
      
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return updatedPost;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    
    // Verify ownership
    if (post.author.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }
    
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<Post[]> {
    // Simple search implementation
    return this.postModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      })
      .populate('author', 'username email')
      .populate('categories')
      .populate('tags')
      .exec();
  }

  private generateSlug(title: string): string {
    const baseSlug = slugify(title, { lower: true, strict: true });
    return `${baseSlug}-${new Date().getTime().toString(36)}`;
  }
} 