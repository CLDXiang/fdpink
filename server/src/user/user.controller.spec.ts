import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { StorageService } from 'src/storage/storage.service';
import { FileService } from 'src/storage/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('Users Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot({})],
      providers: [StorageService, UserService, FileService, { provide: getRepositoryToken(User), useValue: jest.fn() }],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
