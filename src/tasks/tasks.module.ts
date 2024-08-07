import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]), // Import repositories here
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService], // Export service if used in other modules
})
export class TasksModule {}
