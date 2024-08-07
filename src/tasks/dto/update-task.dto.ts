import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'This is a title new task',
    description: 'Title of task',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'This is a description new task',
    description: 'description of task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    type: Boolean,
    example: true,
    description: 'status of completed',
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}