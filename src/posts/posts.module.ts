import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Tag, TagSchema } from './schemas/tag.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CategoriesController } from './categories.controller';
import { TagsController } from './tags.controller';
import { CategoriesService } from './categories.service';
import { TagsService } from './tags.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
    ]),
    UsersModule,
  ],
  controllers: [PostsController, CategoriesController, TagsController],
  providers: [PostsService, CategoriesService, TagsService],
  exports: [PostsService, CategoriesService, TagsService],
})
export class PostsModule {} 