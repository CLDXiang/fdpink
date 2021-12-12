import { Inject, Injectable } from '@nestjs/common';
import { MailTemplateType } from './template';
import { TooManyRequestsException } from 'src/utils/exceptions/too-many-requests.exception';
import { MoreThan, Repository } from 'typeorm';
import { Mail, Status } from 'src/entities/mail';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SucceedDto } from '../auth/dto/succeed.dto';

// MAX_PENDING_INTERVAL defines the maximum time interval (in seconds) a verification request could be satisfied
export const MAX_PENDING_INTERVAL = 60 * 60;
export const MAX_PENDING_NUM = 10;
export const MAX_WAITING_LIMIT = 1000;
export const VERIFICATION_QUEUE = 'verification';

function generateCode() {
  // we need code between [100000, 999999]
  let rand = Math.floor(Math.random() * 1000000) % 1000000;
  if (rand < 100000) {
    rand += 100000;
  }
  return rand.toString();
}

export interface SendMailJob {
  type: MailTemplateType;
  code: string;
  receiver: string;
}

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail) private repo: Repository<Mail>,
    @InjectQueue(VERIFICATION_QUEUE) private queue: Queue,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async getValidMailNum(mailAddr: string) {
    const currentTime = new Date();
    // getTime returns current time in milliseconds
    const offset = new Date(currentTime.getTime() - MAX_PENDING_INTERVAL * 1000);
    this.loggerService.debug(`currentTime ${currentTime}, offset ${offset}`);
    return this.repo.count({
      email: mailAddr,
      requestedAt: MoreThan(offset),
    });
  }

  async isActivated(mailAddr: string) {
    return this.repo.count({
      email: mailAddr,
      status: Status.Activated,
      type: MailTemplateType.Activate,
    });
  }

  async verify(mailAddr: string, code: string): Promise<boolean> {
    this.loggerService.debug(`verify: ${mailAddr} with code ${code}`);
    const records = await this.repo.find({ where: { email: mailAddr, status: Status.Pending, code }, take: 1 });
    if (records.length !== 0) {
      records[0].status = Status.Activated;
      await this.repo.save(records[0]);
      return true;
    }
    return false;
  }

  async requestVerification(type: MailTemplateType, mailAddr: string) {
    this.loggerService.debug(`requestVerification: ${type} to ${mailAddr}`);
    const numPending = await this.getValidMailNum(mailAddr);
    if (numPending > MAX_PENDING_NUM) {
      this.loggerService.warn(`${mailAddr} request too many verification`);
      throw new TooManyRequestsException('该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待');
    }
    const numWaiting = await this.queue.getWaitingCount();
    if (numWaiting > MAX_WAITING_LIMIT) {
      this.loggerService.warn(`mailer queue is very busy`);
      throw new TooManyRequestsException('邮件系统繁忙中，请稍后再试');
    }
    const mail = new Mail();
    mail.code = generateCode();
    mail.email = mailAddr;
    mail.requestedAt = new Date();
    mail.status = Status.Pending;
    mail.type = type;
    await this.repo.save(mail);
    this.loggerService.debug(`requestVerification: ${type} to ${mailAddr} saved! code is ${mail.code}`);
    const job: SendMailJob = {
      type,
      code: mail.code,
      receiver: mailAddr,
    };
    await this.queue.add(job, {
      removeOnComplete: true,
      removeOnFail: false,
      backoff: { type: 'exponential' },
      attempts: 5,
    });
    const cnt = await this.queue.getJobCounts();
    this.loggerService.debug(`requestVerification: job has been enqueued, ${JSON.stringify(cnt)} in queue`);
    return { message: '验证码已发送至您的邮箱中请注意查收' } as SucceedDto;
  }
}
