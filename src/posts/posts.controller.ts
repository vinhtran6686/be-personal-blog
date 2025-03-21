import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as BlogPost } from './schemas/post.schema';

@ApiTags('posts')
@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Post successfully created' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
  ): Promise<BlogPost> {
    // In a real application, this would be implemented with proper authentication
    const userId = req.user?.id || '6426ef13fcb70c1754d80d3a'; // Hardcoded for now
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all blog posts' })
  async findAll(@Query() query: any): Promise<BlogPost[]> {
    return this.postsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for blog posts' })
  @ApiQuery({ name: 'q', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return search results' })
  async search(@Query('q') query: string): Promise<BlogPost[]> {
    return this.postsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the post' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ): Promise<BlogPost> {
    const userId = req.user?.id || '6426ef13fcb70c1754d80d3a'; // Hardcoded for now
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<void> {
    const userId = req.user?.id || '6426ef13fcb70c1754d80d3a'; // Hardcoded for now
    return this.postsService.remove(id, userId);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiParam({ name: 'slug', description: 'Post slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the post' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  async findBySlug(@Param('slug') slug: string): Promise<BlogPost> {
    return this.postsService.findBySlug(slug);
  }
} 