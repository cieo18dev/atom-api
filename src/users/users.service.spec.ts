import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await service.getUserByEmail('test@example.com')).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserByEmail('test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create and return a new user if email does not exist', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      const user = new User();
      user.email = 'test@example.com';

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      expect(await service.createUser(createUserDto)).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com' };
      const user = new User();
      user.email = 'test@example.com';

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
