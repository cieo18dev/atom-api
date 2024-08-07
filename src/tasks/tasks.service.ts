import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllTasksByUserId(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userRepository.findOne({
      where: {
        email: createTaskDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      createdAt: new Date(),
      completed: false,
      user,
    });
    return await this.taskRepository.save(newTask);
  }

  async updateTask(taskId: number, updatedData: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    Object.assign(task, updatedData);
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: number): Promise<void> {
    const result = await this.taskRepository.delete(taskId);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
