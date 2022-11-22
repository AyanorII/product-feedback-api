import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductStatus } from '@prisma/client';
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
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            photo: true,
            name: true,
          },
        },
        comments: true,
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const options = {
      include: {
        user: {
          select: {
            id: true,
            username: true,
            photo: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                username: true,
                photo: true,
                name: true,
              },
            },
          },
        },
      },
    };

    const product = await this.prisma.product.findUnique({
      where: { id },
      ...options,
    });

    if (!product) {
      throw new NotFoundException(`Product with id: '${id}' not found`);
    }

    return product;
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

  async plannedProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'PLANNED',
      },
    });
  }

  async inProgressProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'IN_PROGRESS',
      },
    });
  }

  async liveProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'LIVE',
      },
    });
  }

  async countProducts(): Promise<{
    planned: number;
    inProgress: number;
    live: number;
    suggestion: number;
  }> {
    const plannedCount = await this.#getProductsCountByStatus(
      ProductStatus.PLANNED,
    );

    const inProgressCount = await this.#getProductsCountByStatus(
      ProductStatus.IN_PROGRESS,
    );

    const liveCount = await this.#getProductsCountByStatus(ProductStatus.LIVE);

    const suggestionCount = await this.#getProductsCountByStatus(
      ProductStatus.SUGGESTION,
    );

    return {
      planned: plannedCount,
      inProgress: inProgressCount,
      live: liveCount,
      suggestion: suggestionCount,
    };
  }

  async productsSuggestions(): Promise<Product[]> {
    const suggestions = await this.prisma.product.findMany({
      where: {
        status: 'SUGGESTION',
      },
    });

    return suggestions;
  }

  async upvote(id: string): Promise<Product> {
    try {
      const product = this.prisma.product.update({
        where: {
          id,
        },
        data: {
          upvotes: {
            increment: 1,
          },
        },
      });

      return product;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`Product with ID: '${id}' not found!`);
        }
      }
    }
  }

  /* ---------------------------- Private methods --------------------------- */

  async #getProductsCountByStatus(status: ProductStatus) {
    return this.prisma.product.count({
      where: {
        status,
      },
    });
  }
}
