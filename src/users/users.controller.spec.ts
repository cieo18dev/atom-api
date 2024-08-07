import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      mockUsersService.getUserByEmail.mockResolvedValue(user);

      expect(await controller.getUserByEmail('test@example.com')).toEqual(user);
      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.getUserByEmail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.getUserByEmail('test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user if email does not exist', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      const user = new User();
      user.email = 'test@example.com';

      mockUsersService.createUser.mockResolvedValue(user);

      expect(await controller.createUser(createUserDto)).toEqual(user);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };

      mockUsersService.createUser.mockRejectedValue(new ConflictException());

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
