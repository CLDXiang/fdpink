import {
  Controller,
  UseGuards,
  Param,
  ValidationPipe,
  Req,
  Get,
  Patch,
  Body,
  Inject,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserInfoResponse } from './dto/user-info.get.response';
import { PatchUserInfoRequest } from './dto/user-info.patch.request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly user: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取用户个人信息（本人）' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserInfoResponse,
  })
  async getSelfUserInfo(@Req() req) {
    const user = await this.user.findUserById(req.user.id);
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      bio: user.bio,
    };
    return resp;
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户个人信息（他人），邮箱返回值为空' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserInfoResponse,
  })
  async getUserInfo(@Param('id', new ParseIntPipe()) id: number) {
    const user = await this.user.findUserById(id);
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      bio: user.bio,
    };
    return resp;
  }

  @Patch()
  @ApiOperation({ summary: '修改用户个人信息，并返回修改之后的个人信息。' })
  @ApiBody({ description: '修改个人信息（nickname、bio 为 optional）', type: PatchUserInfoRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserInfoResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '所修改的用户不存在',
  })
  async modifyUserInfo(
    @Body(new ValidationPipe()) patchReq: PatchUserInfoRequest,
    @Req() req,
  ): Promise<GetUserInfoResponse> {
    const user = await this.user.modifyUserInfo(req.user.id, patchReq);
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      bio: user.bio,
    };
    return resp;
  }
}
