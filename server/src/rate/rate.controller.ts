import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  ValidationPipe,
  ParseIntPipe,
  Req,
  Delete,
  Query,
  Patch,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PAGE_LIMIT } from 'src/utils/config';
import { RateService } from './rate.service';
import { UpdateRateDto } from './dto/update-rate.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpStatus } from '@nestjs/common';
import { SucceedDto } from './dto/succeed.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RateInfoResponse } from './dto/rate-info.get.response';

@UseGuards(JwtAuthGuard)
@ApiTags('rates')
@ApiBearerAuth('JWT')
@Controller('rates')
export class RateController {
  constructor(
    private readonly rate: RateService, // private readonly react: ReactService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  // https://stackoverflow.com/questions/59118081/nestjs-validation-failed-numeric-string-is-expected-inside-controllers-nested
  @Post()
  @ApiOperation({
    summary: '就某一门课发布评课内容',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '需验证后才能评论课程',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '评论的课程不存在',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '不能重复评论该课程',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SucceedDto,
  })
  async addRate(@Body(new ValidationPipe()) rate: CreateRateDto, @Req() req) {
    if (!req.user.activated) {
      this.loggerService.warn(`user ${req.user.id} addRate without validation`);
      throw new ForbiddenException('需验证后才能评论课程');
    }
    return this.rate.addRate(rate, req.user.id);
  }

  @Patch(':lectureId')
  @ApiOperation({
    summary: '就某一门课修改评课内容',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '需验证后才能评论课程',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '要修改的评论不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SucceedDto,
  })
  async updateRate(
    @Body(new ValidationPipe()) rate: UpdateRateDto,
    @Param('lectureId', new ParseIntPipe()) lectureId: number,
    @Req() req,
  ) {
    if (!req.user.activated) {
      this.loggerService.warn(`user ${req.user.id} updateRate without validation`);
      throw new ForbiddenException('需验证后才能评论课程');
    }
    return this.rate.updateRate(rate, lectureId, req.user.id);
  }

  @Delete(':lectureId')
  @ApiOperation({
    summary: '删除指定的评论',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '需验证后才能评论课程',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '要删除的评论不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SucceedDto,
  })
  async deleteRate(@Param('lectureId', new ParseIntPipe()) lectureId: number, @Req() req) {
    if (!req.user.activated) {
      this.loggerService.warn(`user ${req.user.id} deleteRate without validation`);
      throw new ForbiddenException('需验证后才能评论课程');
    }
    return this.rate.deleteRate(lectureId, req.user.id);
  }

  @Get()
  @ApiQuery({ name: 'limit', description: '分页大小', required: false })
  @ApiQuery({ name: 'category', description: '课程类别', required: false })
  @ApiQuery({ name: 'last_id', description: '分页起始', required: false })
  @ApiOperation({
    summary: '获取评课内容',
    description: '获取某一类别的评课内容（支持分页，如果没有指定类别则返回最近的评课）。',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [RateInfoResponse],
  })
  async getPagedRates(
    @Query('limit') reqLimit?: number,
    @Query('category') category?: string,
    @Query('last_id') reqLastId?: number,
  ) {
    let limit = PAGE_LIMIT;
    if (reqLimit !== undefined) {
      limit = Math.min(reqLimit, limit);
    }
    let lastId = reqLastId;
    if (lastId === undefined) {
      lastId = Number.MAX_SAFE_INTEGER;
    }
    return this.rate.getNextPagedRates(limit, lastId, category);
  }
}
