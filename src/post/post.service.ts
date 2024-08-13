// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async create(postData: Partial<Post>): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: postData.user.id });
    if (!user) {
      throw new NotFoundException(`User with id ${postData.user.id} not found`);
    }

    const post = this.postRepository.create({ ...postData, user });
    return this.postRepository.save(post);
  }

  async update(id: number, postData: Partial<Post>): Promise<Post> {
    const post = await this.findOne(id);
    const user = postData.user.id
      ? await this.userRepository.findOneBy({ id: postData.user.id })
      : post.user;

    if (postData.user.id && !user) {
      throw new NotFoundException(`User with id ${postData.user.id} not found`);
    }

    this.postRepository.merge(post, { ...postData, user });
    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
