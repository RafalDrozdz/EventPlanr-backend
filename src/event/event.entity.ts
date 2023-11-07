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
  @Column({ nullable: true })
  longitude: string;
  @Column({ nullable: true })
  latitude: string;
  @Column({ type: 'timestamptz' })
  start_date: Date;
  @Column({ type: 'timestamptz' })
  end_date: Date;
}

// @Entity('events')
// export class Events {
//   @PrimaryGeneratedColumn()
//   id: number;
//   @OneToOne(() => User, (user: User) => user.id)
//   creator_user_id: number;
//   @Column()
//   title: string;
//   @Column()
//   description: string;
//   @Column({ nullable: true })
//   status: EventStatus;
//   @Column()
//   place_name: string;
//   @Column({ type: 'timestamptz' })
//   start_date: Date;
//   @Column({ type: 'timestamptz' })
//   end_date: Date;
// }
