// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['email']) // This ensures the email field is unique
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
