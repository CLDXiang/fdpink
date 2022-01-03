import { Injectable, Inject } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Lecture } from '../entities/lecture';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepo: Repository<Lecture>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async getLectureById(id: number, userId: number) {
    const lecture = await this.lectureRepo.findOne(id);
  }
}
