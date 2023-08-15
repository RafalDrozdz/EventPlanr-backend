import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';

export type EventStatus = 'up_to_date' | 'cancelled';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user: User) => user.id)
  creator_user_id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ nullable: true })
  status: EventStatus;
  @Column()
  place_name: string;
  @Column({ type: 'timestamptz' })
  start_date: Date;
  @Column({ type: 'timestamptz' })
  end_date: Date;
}
