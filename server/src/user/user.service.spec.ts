import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, HttpException, NotFoundException, NotImplementedException } from '@nestjs/common';
import { LoggerModule } from 'src/utils/logger';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { newTestOrmConn } from '../storage/storage.service';
import { PatchUserInfoRequest } from './dto/user-info.patch.request';

describe('UsersService', () => {
  let service: UserService;
  let userRepo: Repository<User>;
  beforeAll(async (done) => {
    const ormConn = await newTestOrmConn('users');
    userRepo = ormConn.getRepository(User);
    done();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [UserService, { provide: getRepositoryToken(User), useValue: userRepo }],
    }).compile();

    service = module.get<UserService>(UserService);

    await userRepo.query('DELETE FROM user');
    await userRepo.save([
      { id: 1, name: 'name1', email: 'name1@fudan.edu.cn', saltedPassword: 'xxx' },
      { id: 2, name: 'name2', email: 'name2@fudan.edu.cn', saltedPassword: 'xxx' },
      { id: 3, name: 'name3', email: 'name3@fudan.edu.cn', saltedPassword: 'xxx' },
    ]);
  });

  it('should not add user with same name', async (done) => {
    await service.createNewUser('name1', 'name1@fudan.edu.cn', 'xxxx').catch((e: HttpException) => {
      expect(e).toBeInstanceOf(ConflictException);
      expect(e.message.message).toBe('用户名或邮箱已经被占用'); // TODO: we should create constants for these messages
    });
    done();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should modify user information', async (done) => {
    const patch: PatchUserInfoRequest = {
      nickname: 'testNickName',
      bio: 'who are u',
    };

    const userInfo = await service.modifyUserInfo(2, patch);
    expect(userInfo).toEqual(
      expect.objectContaining({
        nickName: patch.nickname,
        bio: patch.bio,
      }),
    );
    await service.modifyUserInfo(2, { email: 'xxx@xx.com' }).catch((err) => {
      expect(err).toBeInstanceOf(NotImplementedException);
    });
    done();
  });

  it('should modify avatar', async (done) => {
    const patchReqAvatar: PatchUserInfoRequest = {
      avatar: '/avatar',
    };
    const original = await service.findUserById(3);
    const userInfo = await service.modifyUserInfo(3, patchReqAvatar);
    expect(userInfo).toMatchObject({ ...original, avatar: patchReqAvatar.avatar });
    done();
  });

  it('should fail due to user not found', async (done) => {
    await service.modifyUserInfo(10, { avatar: 'xxx' }).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
    });
    done();
  });
});
