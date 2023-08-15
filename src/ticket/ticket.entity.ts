import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { TypeOfTicket } from '../type-of-ticket/type-of-ticket.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user: User) => user.id)
  @Column()
  user_id: number;
  @OneToOne(() => TypeOfTicket, (typeOfTicket: TypeOfTicket) => typeOfTicket.id)
  @Column()
  type_of_ticket_id: number;
}
