import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'creator' | 'participant' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  surname: string;
  @Column({ nullable: true })
  role: UserRole;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
}
