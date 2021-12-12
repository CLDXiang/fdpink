import { Controller, UseGuards, Param, ValidationPipe, Req, Get, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import * as winston from 'winston';
import { UserService } from './user.service';
import { GetUserInfoResponse } from './dto/user-info.get.response';
import { PatchUserInfoRequest } from './dto/user-info.patch.request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = winston.loggers.get('customLogger');

  constructor(private readonly user: UserService) {}

  @Get(':id')
  @ApiParam({
    name: '获取用户个人信息',
    description: "返回个人信息。权限：获取非本人个人信息时，所获取的邮件为空字符串('')。",
  })
  async getUserInfo(@Param('id') id: number, @Req() req) {
    this.logger.info(`{GET users/:id(${id})} from [user:${req.user.id}]`);
    const user = await this.user.findUserById(id);
    if (user.id !== req.user.id) {
      user.email = '';
    }
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      bio: user.bio,
      fans: 0,
      watchees: 0,
      watchers: 0,
    };
    return resp;
  }

  @Patch()
  @ApiParam({
    name: '修改用户个人信息',
    description: '修改用户个人信息，并返回修改之后的个人信息。权限：只允许修改本人的个人信息。',
  })
  async modifyUserInfo(
    @Body(new ValidationPipe()) patchReq: PatchUserInfoRequest,
    @Req() req,
  ): Promise<GetUserInfoResponse> {
    this.logger.info(`{PATCH users/:id(${req.user.id})} `);
    const user = await this.user.modifyUserInfo(req.user.id, patchReq);
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      bio: user.bio,
      fans: 0,
      watchees: 0,
      watchers: 0,
    };
    return resp;
  }
}
