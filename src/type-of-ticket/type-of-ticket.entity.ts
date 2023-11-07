import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Event } from '../event/event.entity';

@Entity('type_of_tickets')
export class TypeOfTicket {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Event, (event: Event) => event.id)
  @Column()
  event_id: number;
  @Column()
  title: string;
  @Column()
  price: number;
  @Column()
  currency: string;
}
