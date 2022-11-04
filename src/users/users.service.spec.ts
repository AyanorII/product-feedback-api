import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../prisma/prisma.service';
import CreateUserDto from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  const users: CreateUserDto[] = [
    { name: 'Alice', password: 'P4ssW0rd!2', username: 'alice' },
    {
      name: 'John Doe',
      password: 'P4ssW0rd!2',
      username: 'johnDoe',
    },
    {
      name: 'John Doe',
      password: 'P4ssW0rd!2',
      username: 'johnDo4wfasdfge',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    beforeEach(async () => {
      await prismaService.cleanDatabase();
    });

    afterEach(async () => {
      await prismaService.cleanDatabase();
    });

    it('should create a user', async () => {
      const [user1, user2] = users;

      expect(usersService.createUser(user1)).resolves.toEqual({
        createdAt: expect.any(Date),
        id: expect.any(String),
        name: 'Alice',
        password: expect.any(String),
        username: 'alice',
        photo: null,
        updatedAt: expect.any(Date),
      });

      expect(usersService.createUser(user2)).resolves.toEqual({
        createdAt: expect.any(Date),
        id: expect.any(String),
        name: 'John Doe',
        password: expect.any(String),
        username: 'johnDoe',
        photo: null,
        updatedAt: expect.any(Date),
      });
    });

    it('should not create a user with already taken username', async () => {
      const [alice] = users;

      try {
        await usersService.createUser(alice);
        await usersService.createUser(alice);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
    });

    it('should store the hashed password instead of the plain password', async () => {
      const [user] = users;

      expect((await usersService.createUser(user)).password).not.toBe(
        'P4ssW0rd!2',
      );
    });
  });

  describe('findUser', () => {
    beforeEach(async () => {
      await prismaService.cleanDatabase();
    });

    afterEach(async () => {
      await prismaService.cleanDatabase();
    });

    it('should find a user by the username', async () => {
      const [alice] = users;
      await usersService.createUser(alice);

      expect(
        await usersService.findUserByUsername(alice.username),
      ).toHaveProperty('id');
    });

    it('should throw a ConflictException if no user was found', async () => {
      try {
        await usersService.findUserByUsername('nonExistingUser');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
