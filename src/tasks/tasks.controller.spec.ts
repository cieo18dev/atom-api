import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { User } from '../users/user.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    getAllTasksByUserId: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTasksByUserId', () => {
    it('should return an array of tasks', async () => {
      const result: Task[] = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Task Description',
          createdAt: new Date(),
          completed: false,
          user: { id: 1, email: 'test@example.com', tasks: [] } as User,
        },
      ];
      jest.spyOn(service, 'getAllTasksByUserId').mockResolvedValue(result);

      expect(await controller.getAllTasksByUserId(1)).toBe(result);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Task Description',
        email: 'test@example.com',
      };

      const user: User = {
        id: 1,
        email: 'test@example.com',
        tasks: [],
      };

      const result: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Task Description',
        createdAt: new Date(),
        completed: false,
        user,
      };

      jest.spyOn(service, 'createTask').mockResolvedValue(result);

      expect(await controller.createTask(createTaskDto)).toEqual(
        new CreateTaskResponseDto(result),
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      const user: User = {
        id: 1,
        email: 'test@example.com',
        tasks: [],
      };

      const result: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        createdAt: new Date(),
        completed: true,
        user,
      };

      jest.spyOn(service, 'updateTask').mockResolvedValue(result);

      expect(await controller.updateTask(1, updateTaskDto)).toBe(result);
    });
  });

  describe('deleteTask', () => {
    it('should delete the task', async () => {
      jest.spyOn(service, 'deleteTask').mockResolvedValue();

      expect(await controller.deleteTask(1)).toBeUndefined();
    });
  });
});
