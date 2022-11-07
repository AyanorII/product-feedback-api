import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Product, ProductCategory, ProductStatus } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { PrismaService } from './../prisma/prisma.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ProductsService, UsersService, ConfigService],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);

    await prismaService.cleanDatabase();

    const user = await usersService.createUser({
      username: 'user',
      password: 'P4ssW0rd!',
    });

    const products: Omit<Product, 'createdAt' | 'id' | 'updatedAt'>[] = [
      {
        title: 'Add tags for solutions',
        category: ProductCategory.FEATURE,
        upvotes: 112,
        status: ProductStatus.PLANNED,
        description: 'It would be nice to be able to add tags to solutions',
        userId: user.id,
      },
    ];
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      expect(user).toHaveProperty('id');

      const [product] = products;

      expect(productsService.create(product)).resolves.toEqual({
        ...product,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = await productsService.findAll();
      products.every((product) => expect(product).toHaveProperty('id'));
    });
  });
});
