import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { User } from '../user/user.entity';

export type EventStatus = 'up_to_date' | 'cancelled';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  creator_user_id: number;
  @Index({ fulltext: true })
  @Column()
  title: string;
  @Index({ fulltext: true })
  @Column()
  description: string;
  @Column()
  status: EventStatus;
  @Column()
  city: string;
  @Column()
  street: string;
  @Column()
  street_number: string;
  @Column()
  postal_code: string;
  @Column()
  country: string;
  @Column()
  place_id: string;
  @Column()
  place_name: string;
  @Column({ nullable: true })
  longitude: string;
  @Column({ nullable: true })
  latitude: string;
  @Column({ type: 'timestamptz' })
  start_date: Date;
  @Column({ type: 'timestamptz' })
  end_date: Date;
}
