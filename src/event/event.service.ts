import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, FindManyOptions } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(data: Omit<Event, 'id'>): Promise<Event> {
    return this.eventRepository.save(data);
  }

  async getAll(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder()
      .orderBy('id', 'DESC')
      .limit(100)
      .getMany();
  }

  async findOne(condition: FindOneOptions<Event>): Promise<Event> {
    return this.eventRepository.findOne(condition);
  }

  async search(searchQuery: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder()
      .select()
      .where('title ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
      .orWhere('description ILIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      })
      .limit(100)
      .getMany();
  }
}
