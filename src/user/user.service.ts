// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: {}, relations: ['posts'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, userData);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    const posts = (await this.userRepository.findOne({
      where: { id: userId },
      select: { posts: true },
      relations: ['posts'],
    })) as unknown as Post[];

    return posts;
  }

  // this api is unoptimal, need to find count from postRepository ideally
  async countUserPosts(userId: number): Promise<any> {
    return (
      await this.userRepository.findOne({
        where: { id: userId },
        relations: ['posts'],
      })
    )?.posts?.length;
  }
}
