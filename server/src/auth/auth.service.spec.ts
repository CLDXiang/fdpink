import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANT_SECRET } from '../utils/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mail } from 'src/entities/mail';
import { User } from 'src/entities/user';
import { StorageService } from 'src/storage/storage.service';
import { UserService } from 'src/user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  const mailRepo = jest.fn();
  const userRepo = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_CONSTANT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        UserService,
        { provide: StorageService, useValue: jest.fn() },
        JwtStrategy,
        { provide: getRepositoryToken(Mail, 'default'), useValue: mailRepo },
        { provide: getRepositoryToken(User, 'default'), useValue: userRepo },
      ],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
