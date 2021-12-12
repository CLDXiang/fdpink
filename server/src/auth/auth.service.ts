import { BadRequestException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user';
import { UserService } from 'src/user/user.service';
import { verifyPassword, saltHashPassword } from '../utils/salt';
import { JwtPayload } from './jwt.strategy';
import { JwtRetDto } from './dto/jwt-ret.dto';
import { RoleType } from '../entities/user';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { ElearningRespondsDto } from './dto/elearning-verify.dto';
import { firstValueFrom } from 'rxjs';
import { SucceedDto } from './dto/succeed.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async validateUser(nameOrMail: string, pass: string): Promise<User> {
    const user = await this.userService.findUserByNameOrMail(nameOrMail);
    if (verifyPassword(pass, user.saltedPassword)) {
      return user;
    }
    throw new NotAcceptableException('密码错误');
  }

  async sign(user: User) {
    // we choose a property name of sub to hold our user.id value to be consistent with JWT standards
    // add activated to payload
    const payload: JwtPayload = { name: user.name, sub: String(user.id) + Number(user.role === RoleType.Activated) };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    } as JwtRetDto;
  }

  async register(name: string, email: string, password: string) {
    await this.userService.createNewUser(name, email, saltHashPassword(password));
    return { message: '注册成功' } as SucceedDto;
  }

  async resetPassword(userId: number, password: string) {
    await this.userService.updateUserPassword(userId, saltHashPassword(password));
    return { message: '密码重置成功' } as SucceedDto;
  }

  async resetMail(userId: number, mail: string) {
    await this.userService.updateUserMail(userId, mail);
    return { message: '邮箱重置成功' } as SucceedDto;
  }

  async changePassword(userId: number, oldPassword: string, newPassowrd: string) {
    const user = await this.userService.findUserById(userId);
    if (verifyPassword(oldPassword, user.saltedPassword)) {
      this.userService.updateUserPassword(userId, saltHashPassword(newPassowrd));
      return { message: '密码重置成功' } as SucceedDto;
    }
    throw new BadRequestException('旧密码错误');
  }

  async elearningVerify(token: string, userId: number) {
    await firstValueFrom(
      this.httpService
        .get('https://elearning.fudan.edu.cn/api/v1/users/self/profile', {
          params: {
            access_token: token,
          },
        })
        .pipe(
          map((response: AxiosResponse<ElearningRespondsDto>) => {
            return { id: response.data.login_id };
          }),
        ),
    ).catch((e) => {
      this.loggerService.warn(e);
      throw new NotFoundException('token 错误');
    });
    this.userService.activateById(userId);
    return { message: '验证成功' } as SucceedDto;
  }
}
