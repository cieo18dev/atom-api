import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiQuery({
    name: 'email',
    description: 'Email of the user to retrieve',
    required: true,
    example: 'sampltest@gmail.com',
  })
  getUserByEmail(@Query('email') email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'User data', type: User })
  createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.createUser(data);
  }
}
