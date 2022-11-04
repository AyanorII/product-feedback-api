import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Seeding database...');

async function main() {
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

    console.log(`Created user: ${user.username}`);
  }
}

main();
