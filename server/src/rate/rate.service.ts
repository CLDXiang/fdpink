import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeletedBy, Rate } from 'src/entities/rate';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Lecture } from '../entities/lecture';
import { CreateRateDto } from './dto/create-rate.dto';
import { SucceedDto } from './dto/succeed.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RateInfoResponse } from './dto/rate-info.get.response';

export const RATE_FIELDS = `rate.id, rate.semester, rate.category, rate.created_at AS createdAt, user_id, lecture_id, updated_at AS updatedAt,
JSON_OBJECT('difficulty', difficulty, 'nice', nice, 'workload', workload, 'recommended', recommended, 'content', content) AS form`;

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate) private readonly rateRepo: Repository<Rate>,
    @InjectRepository(Lecture) private readonly lectureRepo: Repository<Lecture>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async getNextPagedRates(limit: number, lastId: number, category: string): Promise<RateInfoResponse[]> {
    const sql = `
    SELECT rawrate.id, rawrate.createdAt, rawrate.updatedAt, rawrate.semester, rawrate.category, rawrate.form,
      JSON_OBJECT('id', user.id, 'nickname', user.nickname) AS creator,
      JSON_OBJECT('id', lecture.id, 'name', lecture.name, 'teachers', lecture.teachers, 'category', lecture.category) AS lecture
    FROM (SELECT ${RATE_FIELDS}
          FROM rate WHERE
          ${category !== undefined ? 'category = ? AND ' : ''}
            rate.id < ?
            AND is_deleted = FALSE
          ORDER BY rate.id DESC
          LIMIT ?) AS rawrate
    LEFT JOIN user ON rawrate.user_id = user.id
    LEFT JOIN lecture ON lecture_id = lecture.id
    `;
    if (category !== undefined) {
      console.log(category);
      return this.rateRepo.manager.query(sql, [category, lastId, limit]);
    } else {
      return this.rateRepo.manager.query(sql, [lastId, limit]);
    }
  }

  async addRate(rate: CreateRateDto, userId: number) {
    const lecture = await this.lectureRepo.findOne(rate.lectureId);
    if (lecture === undefined) {
      throw new NotFoundException('评论的课程不存在');
    }
    const oldRate = await this.rateRepo.findOne({
      where: { lectureId: rate.lectureId, userId, isDeleted: false },
    });
    if (oldRate !== undefined) {
      return new ConflictException('不能重复评论该课程');
    }
    const newRate = new Rate();
    newRate.lectureId = rate.lectureId;
    newRate.category = lecture.category;
    newRate.userId = userId;
    newRate.semester = rate.semester;
    newRate.difficulty = rate.difficulty;
    newRate.workload = rate.workload;
    newRate.nice = rate.nice;
    newRate.recommended = rate.recommended;
    newRate.content = rate.content;
    await this.rateRepo.save(newRate);
    return { message: '创建评论成功' } as SucceedDto;
  }

  async deleteRate(lectureId: number, userId: number) {
    const oldRate = await this.rateRepo.findOne({
      where: { lectureId, userId, isDeleted: false },
    });
    if (oldRate === undefined) {
      throw new NotFoundException({ msg: '要删除的评论不存在' });
    }
    oldRate.isDeleted = true;
    oldRate.deletedBy = DeletedBy.Self;
    await this.rateRepo.save(oldRate);
    return { message: '删除评论成功' } as SucceedDto;
  }

  async updateRate(update: UpdateRateDto, lectureId: number, userId: number) {
    const oldRate = await this.rateRepo.findOne({
      where: { lectureId, userId, isDeleted: false },
    });
    if (oldRate === undefined) {
      throw new NotFoundException({ msg: '要修改的评论不存在' });
    }
    let updated = false;
    if (update.difficulty !== undefined) {
      oldRate.difficulty = update.difficulty;
      updated = true;
    }
    if (update.nice !== undefined) {
      oldRate.nice = update.nice;
      updated = true;
    }
    if (update.recommended !== undefined) {
      oldRate.recommended = update.recommended;
      updated = true;
    }
    if (update.workload !== undefined) {
      oldRate.workload = update.workload;
      updated = true;
    }
    if (update.content !== undefined) {
      oldRate.content = update.content;
      updated = true;
    }
    if (updated === false) {
      return oldRate;
    }
    await this.rateRepo.save(oldRate);
    return { message: '修改评论成功' } as SucceedDto;
  }
}
