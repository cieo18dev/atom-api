import { Task } from '../task.entity';

export class CreateTaskResponseDto {
  public readonly task: Task;

  constructor(task: Task) {
    this.task = task;
  }
}
