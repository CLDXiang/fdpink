import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureController } from './lecture.controller';
import { PortService } from './port.service';
import { Instructor } from '../entities/instructor';
import { Lesson } from '../entities/lesson';
import { Lecture } from '../entities/lecture';
import { TeachLecture } from '../entities/teach_lecture';
import { RateModule } from '../rate/rate.module';
import { LectureService } from './lecture.service';
import { Rate } from 'src/entities/rate';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, Lesson, Lecture, TeachLecture, Rate], 'default'), RateModule],
  controllers: [LectureController],
  providers: [PortService, LectureService],
  exports: [PortService, TypeOrmModule],
})
export class LectureModule {}
