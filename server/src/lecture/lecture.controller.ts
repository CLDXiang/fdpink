import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DevGuard } from '../utils/dev.guard';
import { PortService } from './port.service';
import { ImportLessonDto } from './dto/import-lesson.dto';
import { LectureService } from './lecture.service';

@ApiTags('lectures')
@Controller('lectures')
@ApiBearerAuth()
export class LectureController {
  constructor(private readonly portService: PortService, private readonly lecture: LectureService) {}

  @UseGuards(DevGuard)
  @Post('import_lesson')
  @ApiOperation({ summary: '（DEV 模式下）批量导入课程' })
  @ApiBody({ description: '课程导入数据', type: [ImportLessonDto] })
  async importLesson(@Body() payload: ImportLessonDto[]) {
    await this.portService.importLessonBatch(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取 lecture 信息' })
  async getLectureById(@Param('id', new ParseIntPipe()) id: number, @Req() req) {
    return this.lecture.getLectureById(id, req.user.id);
  }
}
