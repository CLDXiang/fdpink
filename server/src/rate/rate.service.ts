import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';

import { RateType } from 'src/types/rate';
import { InjectRepository } from '@nestjs/typeorm';
import { DeletedBy, Rate } from 'src/entities/rate';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Lecture } from '../entities/lecture';
import { CreateRateDto } from './dto/create-rate.dto';
import { SucceedDto } from './dto/succeed.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

const TEACHERS = 'taughtBy';

const RATE_FORM_FIELDS = 'difficulty, workload, nice, recommended, content';

const RATE_FIELDS = `rate.id, rate.created_at AS createdAt, user_id, lecture_id, universal_id.id AS universal_id, updated_at AS updatedAt,
JSON_OBJECT('difficulty', difficulty, 'nice', nice, 'workload', workload, 'recommended', recommended, 'content', content) AS form`;

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate) private readonly rateRepo: Repository<Rate>,
    @InjectRepository(Lecture) private readonly lectureRepo: Repository<Lecture>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  /**
   * Convert the database-retrived rate data to what the frontend need
   */
  static dealRawRates(rawrates): RateType[] {
    return rawrates.map((rawrate) => {
      // const rawreact = await this.reactService.getReactInfo(rawrate.universal_id);
      // rawrate.reaction = rawreact.data;
      return {
        id: rawrate.id.toString(),
        creator: {
          ...rawrate.creator,
          id: rawrate.creator.id.toString(),
          nickname: rawrate.creator.nickname || rawrate.creator.name,
        },
        createdAt: rawrate.createdAt,
        updatedAt: rawrate.updatedAt,
        form: rawrate.form,
        lecture: {
          ...rawrate.lecture,
          id: rawrate.lecture.id.toString(),
          taughtBy: rawrate.lecture[TEACHERS].split('@@'),
        },
        // commentCount: rawrate.commentCount,
        // starCount: rawrate.starCount,
        // starred: rawrate.starred,
        // reaction: rawrate.reaction,
        // universalId: rawrate.universal_id,
      } as RateType;
    });
  }

  async getLimitedNextPagedRates(
    queryField: string,
    // can be lectureId or userId
    queryValue: number,
    limit: number,
    lastId: number,
  ) {
    const { results: rawrates } = await this.storage.query(
      `
      SELECT DISTINCT rawrate.*,
        JSON_OBJECT('id', user.id, 'nickname', user.nickname, 'name', user.name, 'avatar', user.avatar) AS creator,
        JSON_OBJECT('id', lecture.id, 'name', lecture.name, 'taughtBy', lecture.taught_by, 'category', lecture.category) AS lecture
      FROM (SELECT ${RATE_FIELDS}
            FROM rate, universal_id
            WHERE ${queryField} = ?
              AND rate.id < ?
              AND is_deleted = FALSE
              AND universal_id.type = 'rate'
              AND rate.id = universal_id.type_id
            ORDER BY rate.id DESC
            LIMIT ?) AS rawrate
      LEFT JOIN user ON rawrate.user_id = user.id
      LEFT JOIN lecture ON lecture_id = lecture.id
      `,
      [queryValue, lastId, limit],
    );

    return RateService.dealRawRates(rawrates);
  }

  async getLimitedPagedRates(queryField: string, queryValue: number, limit: number) {
    const { results: rawrates } = await this.storage.query(
      `
      SELECT DISTINCT rawrate.*,
        JSON_OBJECT('id', user.id, 'nickname', user.nickname, 'name', user.name, 'avatar', user.avatar) AS creator,
        JSON_OBJECT('id', lecture.id, 'name', lecture.name, 'taughtBy', lecture.taught_by, 'category', lecture.category) AS lecture
      FROM (SELECT ${RATE_FIELDS}
            FROM rate, universal_id
            WHERE ${queryField} = ?
              AND is_deleted = FALSE
              AND universal_id.type = 'rate'
              AND rate.id = universal_id.type_id
            ORDER BY rate.id DESC
            LIMIT ?) AS rawrate
      LEFT JOIN user ON rawrate.user_id = user.id
      LEFT JOIN lecture ON lecture_id = lecture.id
      `,
      [queryValue, limit],
    );

    return RateService.dealRawRates(rawrates);
  }

  async getNextPagedRates(limit: number, lastId: number) {
    const { results: rawrates } = await this.storage.query(
      `
      SELECT DISTINCT rawrate.*,
        JSON_OBJECT('id', user.id, 'nickname', user.nickname, 'name', user.name, 'avatar', user.avatar) AS creator,
        JSON_OBJECT('id', lecture.id, 'name', lecture.name, 'taughtBy', lecture.taught_by, 'category', lecture.category)     AS lecture
      FROM (SELECT ${RATE_FIELDS}
            FROM rate, universal_id
            WHERE rate.id < ?
              AND is_deleted = FALSE
              AND universal_id.type = 'rate'
              AND rate.id = universal_id.type_id
            ORDER BY rate.id DESC
            LIMIT ?) AS rawrate
      LEFT JOIN user ON rawrate.user_id = user.id
      LEFT JOIN lecture ON lecture_id = lecture.id
      `,
      [lastId, limit],
    );

    return RateService.dealRawRates(rawrates);
  }

  async addRate(rate: CreateRateDto, userId: number) {
    const lecture = await this.lectureRepo.findOne(rate.lectureId);
    if (lecture === null) {
      throw new NotFoundException('评论的课程不存在');
    }
    const oldRate = await this.rateRepo.findOne({
      where: { lectureId: rate.lectureId, userId, isDeleted: false },
    });
    if (oldRate !== null) {
      return new ConflictException('不能重复评论该课程');
    }
    const newRate = new Rate();
    newRate.lectureId = rate.lectureId;
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
    if (oldRate === null) {
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
    if (oldRate === null) {
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
    const newRate = await this.rateRepo.save(oldRate);
    return newRate;
  }

  async getRateDetailById(rateId: number) {
    const { results: rawrates } = await this.storage.query(
      `
      SELECT DISTINCT rawrate.*,
        JSON_OBJECT('id', user.id, 'nickname', user.nickname, 'name', user.name, 'avatar', user.avatar) AS creator,
        JSON_OBJECT('id', lecture.id, 'name', lecture.name, 'taughtBy', lecture.taught_by, 'category', lecture.category) AS lecture
      FROM (SELECT ${RATE_FIELDS}
            FROM rate, universal_id
            WHERE rate.id = ?
              AND universal_id.type = 'rate'
              AND universal_id.type_id = rate.id
              AND is_deleted = FALSE) AS rawrate
      LEFT JOIN user ON rawrate.user_id = user.id
      LEFT JOIN lecture ON lecture_id = lecture.id
      `,
      [rateId],
    );

    if (rawrates.length === 0) {
      throw new NotFoundException({ msg: '未找到指定课程' });
    }

    const results = RateService.dealRawRates(rawrates);
    return results[0];
  }
}
