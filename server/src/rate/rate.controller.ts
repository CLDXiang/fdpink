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
  BadRequestException,
  Patch,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PAGE_LIMIT } from 'src/utils/config';
import { RateType } from 'src/types/rate';
import { RateService } from './rate.service';
import { UpdateRateDto } from './dto/update-rate.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HttpStatus } from '@nestjs/common';
import { SucceedDto } from './dto/succeed.dto';
import { Rate } from '../entities/rate';

@UseGuards(AuthGuard('jwt'))
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
    status: HttpStatus.CREATED,
    type: Rate,
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
    status: HttpStatus.CREATED,
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
  @ApiOperation({
    summary: '获取评课内容',
    description: '获取某一课程或某一用户的评课内容（支持分页）。',
  })
  async getPagedRates(
    @Query('limit') reqLimit?: number,
    @Query('lecture_id') lectureId?: number,
    @Query('user_id') userId?: string,
    @Query('last_id') reqLastId?: string,
  ) {
    let limit = PAGE_LIMIT;
    if (limit !== undefined) {
      limit = reqLimit;
      if (limit > PAGE_LIMIT) {
        throw new BadRequestException({ msg: '请求的分页过大' });
      }
    }
    let lastId = reqLastId;
    if (lastId === undefined) {
      lastId = Number.MAX_SAFE_INTEGER.toString();
    }

    let results: RateType[];
    if (lectureId !== undefined) {
      results = await this.rate.getLimitedNextPagedRates(
        'lecture_id',
        parseInt(lectureId, 10),
        limit,
        parseInt(lastId, 10),
      );
    } else if (userId !== undefined) {
      results = await this.rate.getLimitedNextPagedRates('user_id', parseInt(userId, 10), limit, parseInt(lastId, 10));
    } else {
      results = await this.rate.getNextPagedRates(limit, parseInt(lastId, 10));
    }
    return {
      data: results.map((result) => ({
        ...result,
        commentCount: 0,
        starCount: 0,
        starred: false,
        reaction: { id: '1', count: 0, emoji: {} },
      })),
    };
  }
}
