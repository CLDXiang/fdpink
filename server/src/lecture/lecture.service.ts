import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Lecture } from '../entities/lecture';
import { RelatedLectures, LectureInfoResponse } from './dto/lecture-info.get.response';
import { RATE_FIELDS } from 'src/rate/rate.service';
import { Rate } from '../entities/rate';
import { RateInfoResponse } from 'src/rate/dto/rate-info.get.response';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepo: Repository<Lecture>,
    @InjectRepository(Rate) private readonly rateRepo: Repository<Rate>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async getLecturesByNameOrTeacher(q: string) {
    return this.lectureRepo.find({
      where: [{ name: Like(`%${q}%`) }, { teachers: Like(`%${q}%`) }],
      select: ['id', 'name', 'category', 'teachers', 'semester'],
    });
  }

  async getLectureById(id: number) {
    const lecture = await this.lectureRepo.findOne(id, {
      select: ['id', 'code', 'name', 'category', 'teachers', 'semester'],
    });
    if (lecture === undefined) {
      throw new NotFoundException('课程不存在');
    }
    // 其他老师开设的平行课程
    const lectures0: RelatedLectures[] = (
      await this.lectureRepo
        .createQueryBuilder('l')
        .select(['l.id AS id', 'l.name AS name', 'l.teachers AS teachers', 'l.semester AS semester'])
        .where('l.code = :code', { code: lecture.code })
        .getRawMany()
    ).filter((lec) => lec.id !== id);
    // 当前课程老师开设的其他课程
    const sql = `SELECT l.id, l.name, l.semester, t2.name as teachers FROM (SELECT t1.instructor_id, instructor.name, t1.lecture_id FROM 
      (SELECT instructor_id FROM teach_lecture WHERE lecture_id = ?) AS t
       LEFT JOIN teach_lecture t1 ON t.instructor_id = t1.instructor_id
       LEFT JOIN instructor ON instructor.id = t1.instructor_id) AS t2
       LEFT JOIN lecture l ON t2.lecture_id = l.id`;
    const lectures1: RelatedLectures[] = (await this.lectureRepo.manager.query(sql, [id])).filter(
      (lec) => lec.id !== id,
    );
    return {
      ...lecture,
      LecturesWithSameInstructor: lectures1,
      LecturesWithSameName: lectures0,
    } as LectureInfoResponse;
  }

  async getNextPagedRatesByLectureId(lectureId: number, limit: number, lastId: number): Promise<RateInfoResponse[]> {
    const sql = `
    SELECT rawrate.id, rawrate.createdAt, rawrate.updatedAt, rawrate.semester, rawrate.category, rawrate.form,
      JSON_OBJECT('id', user.id, 'nickname', user.nickname) AS creator
    FROM (SELECT ${RATE_FIELDS}
          FROM rate
          WHERE lecture_id = ?
            AND rate.id < ?
            AND is_deleted = FALSE
          ORDER BY rate.id DESC
          LIMIT ?) AS rawrate
    LEFT JOIN user ON rawrate.user_id = user.id
    `;
    return this.rateRepo.manager.query(sql, [lectureId, lastId, limit]);
  }
}
