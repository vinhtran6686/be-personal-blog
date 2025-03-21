import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';

@ApiTags('tags')
@Controller('api/v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tag successfully created' })
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all tags' })
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the tag' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tag successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tag successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tagsService.remove(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a tag by slug' })
  @ApiParam({ name: 'slug', description: 'Tag slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the tag' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async findBySlug(@Param('slug') slug: string): Promise<Tag> {
    return this.tagsService.findBySlug(slug);
  }
} 