import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Event } from '../event/event.entity';

@Entity('type_of_tickets')
export class TypeOfTicket {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Event, (event: Event) => event.id)
  @Column()
  event_id: number;
  @Column()
  price: number;
  @Column()
  name: string;
  @Column()
  description: string;
}
