// src/post/post.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  @Post()
  async create(@Body() postData: Partial<PostEntity>): Promise<PostEntity> {
    return this.postService.create(postData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() postData: Partial<PostEntity>,
  ): Promise<PostEntity> {
    return this.postService.update(id, postData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.postService.remove(id);
  }
}
