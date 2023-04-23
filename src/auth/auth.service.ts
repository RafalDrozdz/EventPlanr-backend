/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.save(data);
  }

  async findOne(condition: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(condition);
  }
}
