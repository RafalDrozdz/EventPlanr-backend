import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';
import { EventStatus } from './event.entity';

export class CreateEventDto {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  tickets: Omit<TypeOfTicket, 'id' | 'event_id'>[];
  status: EventStatus;
  city: string;
  street: string;
  street_number: string;
  postal_code: string;
  country: string;
  place_id: string;
  longitude: string;
  latitude: string;
}
