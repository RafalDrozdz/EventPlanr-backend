import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { TypeOfTicket } from './type-of-ticket.entity';

@Injectable()
export class TypeOfTicketService {
  constructor(
    @InjectRepository(TypeOfTicket)
    private readonly typeOfTicketRepository: Repository<TypeOfTicket>,
  ) {}

  async create(data: Omit<TypeOfTicket, 'id'>): Promise<TypeOfTicket> {
    return this.typeOfTicketRepository.save(data);
  }

  async find(condition: FindOneOptions<TypeOfTicket>): Promise<TypeOfTicket[]> {
    return this.typeOfTicketRepository.find(condition);
  }
}
