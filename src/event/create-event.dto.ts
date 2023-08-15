import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';

export class CreateEventDto {
  title: string;
  description: string;
  place_name: string;
  start_date: Date;
  end_date: Date;
  tickets: Omit<TypeOfTicket, 'id' | 'event_id'>[];
}
