import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // async getTickets(event_id: number): Promise<TypeOfTicket[]> {
  //   return this.typeOfTicketRepository.find({
  //     where: { event_id },
  //     order: { price: 'asc' },
  //   });
  // }
  // : Promise<TypeOfTicket[]>
  async getCheapestTicket(event_id: number) {
    return this.typeOfTicketRepository.findOne({
      where: { event_id },
      order: { price: 'asc' },
    });
  }
}
