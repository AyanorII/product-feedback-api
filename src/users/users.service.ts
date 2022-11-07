import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './../prisma/prisma.service';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    try {
      const user = await this.prisma.user.create({
        data: { ...rest, password: hashedPassword },
      });

      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('Username already exists');
        }
      }
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.findUser('username', username);
  }

  async findUserById(id: string): Promise<User> {
    return this.findUser('id', id);
  }

  async findUser(by: 'id' | 'username', value: string): Promise<User> {
    const user =
      by === 'id'
        ? await this.prisma.user.findUnique({ where: { id: value } })
        : await this.prisma.user.findUnique({
            where: { username: value },
          });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
