import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DevGuard } from '../utils/dev.guard';
import { PortService } from './port.service';
import { ImportLessonDto } from './dto/import-lesson.dto';
import { LectureService } from './lecture.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LectureInfoResponse } from './dto/lecture-info.get.response';
import { LecturesSearchResponse } from './dto/lectures-search.get.response';
import { RateInfoResponse } from 'src/rate/dto/rate-info.get.response';
import { PAGE_LIMIT } from 'src/utils/config';

@ApiTags('lectures')
@Controller('lectures')
export class LectureController {
  constructor(private readonly portService: PortService, private readonly lecture: LectureService) {}

  @UseGuards(DevGuard)
  @Post('import_lesson')
  @ApiOperation({ summary: '（DEV 模式下）批量导入课程' })
  @ApiBody({ description: '课程导入数据', type: [ImportLessonDto] })
  async importLesson(@Body() payload: ImportLessonDto[]) {
    await this.portService.importLessonBatch(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get('search')
  @ApiQuery({ name: 'q', description: '课程名称或授课老师' })
  @ApiOperation({ summary: '检索获得 lecture 信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LecturesSearchResponse,
  })
  async getLecturesByNameOrTeacher(@Query('q') q: string) {
    return this.lecture.getLecturesByNameOrTeacher(q);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Get(':id')
  @ApiOperation({ summary: '获取 lecture 信息' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '课程不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LectureInfoResponse,
  })
  async getLectureById(@Param('id', new ParseIntPipe()) id: number) {
    return this.lecture.getLectureById(id);
  }

  @Get('rates/:lectureId')
  @ApiQuery({ name: 'limit', description: '分页大小', required: false })
  @ApiQuery({ name: 'last_id', description: '分页起始', required: false })
  @ApiOperation({ summary: '获取课程评课记录' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [RateInfoResponse],
  })
  async getNextPagedRatesByUserId(
    @Param('lectureId', new ParseIntPipe()) lectureId: number,
    @Query('limit') reqLimit?: number,
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
    return this.lecture.getNextPagedRatesByLectureId(lectureId, limit, lastId);
  }
}
