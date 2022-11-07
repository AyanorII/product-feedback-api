import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.create({
        data: { ...createCommentDto },
      });

      return comment;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new NotFoundException('User or Product not found');
        }
      }
    }
  }

  async findAll(): Promise<Comment[]> {
    return this.prisma.comment.findMany();
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });

      return comment;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Comment with ID: '${id}' not found`);
        }
      }
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.findOne(id);

    return this.prisma.comment.update({
      where: { id },
      data: { ...updateCommentDto },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.comment.delete({ where: { id } });
  }
}
