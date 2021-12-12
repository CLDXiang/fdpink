import { ConflictException, Inject, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { RoleType, User } from 'src/entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatchUserInfoRequest } from './dto/user-info.patch.request';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryError } from '../storage/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async findUserByNameOrMail(nameOrMail: string): Promise<User> {
    let user: User;
    if (nameOrMail.indexOf('@') !== -1) {
      const results = await this.userRepo.find({ where: { email: nameOrMail } });
      if (results.length === 0) {
        throw new NotFoundException('邮箱错误，该用户不存在');
      }
      [user] = results;
    } else {
      const results = await this.userRepo.find({ where: { name: nameOrMail } });
      if (results.length === 0) {
        throw new NotFoundException('用户名错误，该用户不存在');
      }
      [user] = results;
    }
    return user;
  }

  async findUserById(userId: number): Promise<User> {
    return this.userRepo.findOne(userId);
  }

  async activateById(userId: number) {
    return this.userRepo.update(userId, { role: RoleType.Activated }).catch((e) => {
      this.loggerService.error(e);
      throw e;
    });
  }

  async updateUserPassword(userId: number, newSaltedPassword: string) {
    return this.userRepo.update(userId, { saltedPassword: newSaltedPassword }).catch((e) => {
      this.loggerService.error(e);
      throw e;
    });
  }

  async updateUserMail(userId: number, newMail: string) {
    return this.userRepo.update(userId, { email: newMail }).catch((e) => {
      this.loggerService.error(e);
      throw e;
    });
  }

  async createNewUser(name: string, email: string, saltedPassword: string) {
    const user = this.userRepo.create({
      name,
      email,
      saltedPassword,
      nickName: name,
    });
    await this.userRepo.save(user).catch((e) => {
      if (e.code === QueryError.DuplicateEntry) {
        throw new ConflictException('用户名或邮箱已经被占用');
      }
      this.loggerService.error(e);
      throw e;
    });
  }

  async modifyUserInfo(id: number, req: PatchUserInfoRequest): Promise<User> {
    if (req.email !== undefined) {
      throw new NotImplementedException('抱歉，修改邮箱功能还在开发中哦！');
    }
    let user = await this.findUserById(id);
    if (user === undefined) {
      throw new NotFoundException('所修改的用户不存在');
    }
    if (req.nickname !== undefined) {
      user.nickName = req.nickname;
    }
    if (req.bio !== undefined) {
      user.bio = req.bio;
    }
    user = await this.userRepo.save(user);
    return user;
  }
}
