import { faker } from '@faker-js/faker';
import { PrismaClient, ProductCategory, ProductStatus } from '@prisma/client';
import { randomIndex } from '../lib/helpers';
import { toUpperSnakeCase } from './../lib/helpers';
import data from './data';

const prisma = new PrismaClient();

console.log('Seeding database...');

async function main() {
  await prisma.user.deleteMany();

  const users = [];

  for (let i = 0; i < 10; i++) {
    const name = faker.name.fullName();
    const username = faker.internet.userName();
    const image = faker.image.avatar();
    const password = faker.internet.password();

    const user = await prisma.user.create({
      data: {
        name,
        username,
        photo: image,
        password,
      },
    });

    users.push(user);

    console.log(`Created user: ${user.username}`);
  }

  data.productRequests.forEach(
    async ({ id, comments, status, category, ...product }) => {
      const createdProduct = await prisma.product.create({
        data: {
          ...product,
          status: toUpperSnakeCase(status) as ProductStatus,
          category: toUpperSnakeCase(category) as ProductCategory,
          userId: users[randomIndex(users)].id,
        },
      });

      console.log(`Created product: ${createdProduct.title}`);

      comments?.forEach(async (comment) => {
        const createdComment = await prisma.comment.create({
          data: {
            content: comment.content,
            userId: users[randomIndex(users)].id,
            productId: createdProduct.id,
          },
        });

        console.log(`Created comment: ${createdComment.content}`);
      });
    },
  );
}

main();
