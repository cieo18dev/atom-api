import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'This is a title new task',
    description: 'Title of task',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'This is a description new task',
    description: 'description of task',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'sampltest@gmail.com',
    description: 'User email owns task',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
