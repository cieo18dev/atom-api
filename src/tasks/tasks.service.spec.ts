import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasksByUserId', () => {
    it('should return an array of tasks', async () => {
      const userId = 1;
      const tasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          createdAt: new Date(),
          completed: false,
          user: { id: 1, email: 'user@example.com', tasks: [] } as User,
        },
      ];

      mockTaskRepository.find.mockResolvedValue(tasks);

      expect(await service.getAllTasksByUserId(userId)).toEqual(tasks);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        email: 'user@example.com',
      };

      const user: User = {
        id: 1,
        email: 'user@example.com',
        tasks: [],
      };

      const task: Task = {
        id: 1,
        title: 'New Task',
        description: 'Task Description',
        createdAt: new Date(),
        completed: false,
        user,
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockTaskRepository.create.mockReturnValue(task);
      mockTaskRepository.save.mockResolvedValue(task);

      expect(await service.createTask(createTaskDto)).toEqual(task);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createTaskDto.email },
      });
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        createdAt: expect.any(Date),
        completed: false,
        user,
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
        email: 'user@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.createTask(createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const taskId = 1;
      const updatedData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      const task: Task = {
        id: taskId,
        title: 'Original Task',
        description: 'Original Description',
        createdAt: new Date(),
        completed: false,
        user: { id: 1, email: 'user@example.com', tasks: [] } as User,
      };

      const updatedTask: Task = {
        ...task,
        ...updatedData,
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      expect(await service.updateTask(taskId, updatedData)).toEqual(
        updatedTask,
      );
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = 1;
      const updatedData = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.updateTask(taskId, updatedData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete the task', async () => {
      const taskId = 1;

      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteTask(taskId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = 1;

      mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteTask(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
