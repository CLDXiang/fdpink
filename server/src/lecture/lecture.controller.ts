import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DevGuard } from '../utils/dev.guard';
import { PortService } from './port.service';
import { ImportLessonDto } from './dto/import-lesson.dto';

@ApiTags('lectures')
@Controller('lectures')
@ApiBearerAuth()
export class LectureController {
  constructor(private readonly portService: PortService) {}

  @UseGuards(DevGuard)
  @Post('import_lesson')
  @ApiOperation({ summary: '（DEV 模式下）批量导入课程' })
  @ApiBody({ description: '课程导入数据', type: [ImportLessonDto] })
  async importLesson(@Body() payload: ImportLessonDto[]) {
    await this.portService.importLessonBatch(payload);
  }
}
