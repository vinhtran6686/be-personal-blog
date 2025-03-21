import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@ApiTags('categories')
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Category successfully created' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all categories' })
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the category' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the category' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Category not found' })
  async findBySlug(@Param('slug') slug: string): Promise<Category> {
    return this.categoriesService.findBySlug(slug);
  }
} 