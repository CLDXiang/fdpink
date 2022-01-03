import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureController } from './lecture.controller';
import { PortService } from './port.service';
import { Instructor } from '../entities/instructor';
import { Lesson } from '../entities/lesson';
import { Lecture } from '../entities/lecture';
import { TeachLecture } from '../entities/teach_lecture';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, Lesson, Lecture, TeachLecture], 'default')],
  controllers: [LectureController],
  providers: [PortService],
  // providers: [UserService, StorageService, FileService],
  exports: [PortService, TypeOrmModule],
})
export class LectureModule {}
