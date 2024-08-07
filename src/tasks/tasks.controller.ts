import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks by user ID' })
  @ApiQuery({
    name: 'userId',
    description: 'ID of the user to retrieve tasks for',
    required: true,
    example: 1,
  })
  async getAllTasksByUserId(@Query('userId') userId: number): Promise<Task[]> {
    return this.tasksService.getAllTasksByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<CreateTaskResponseDto> {
    const task = await this.tasksService.createTask(createTaskDto);
    return new CreateTaskResponseDto(task);
  }

  @Put(':taskId')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({
    name: 'taskId',
    description: 'ID of the task to update',
    example: 1,
  })
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({
    name: 'taskId',
    description: 'ID of the task to delete',
    example: 1,
  })
  async deleteTask(@Param('taskId') taskId: number): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }
}
