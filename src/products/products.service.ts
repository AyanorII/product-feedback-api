import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { userId, ...data } = createProductDto;

    const user = await this.usersService.findUserById(userId);

    const product = await this.prisma.product.create({
      data: {
        ...data,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              photo: true,
              name: true,
            },
          },
        },
      });

      return product;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`Product with ID: '${id}' not found`);
        }
      }
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
  }
}
