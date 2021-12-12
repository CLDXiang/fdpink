import { getTemplate, render } from './template';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { SendMailJob, VERIFICATION_QUEUE } from './mail.service';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { Mailer } from './mailer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export const MAILERS_TOKEN = 'PROCESSOR_MAILERS';

@Processor(VERIFICATION_QUEUE)
export class MailProcessor {
  constructor(
    @Inject(MAILERS_TOKEN) private readonly mailers: Mailer[],
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  @Process()
  async send(job: Job<SendMailJob>) {
    this.loggerService.debug(`send ${JSON.stringify(job)}`);
    const { type, ...args } = job.data;
    let id = 0;
    let earliest = this.mailers[id].nextReady();
    for (let i = 1; i < this.mailers.length; i++) {
      const next = this.mailers[i].nextReady();
      if (next < earliest) {
        earliest = next;
        id = i;
      }
    }

    const mailer = this.mailers[id];
    const { subject } = getTemplate(type);
    await mailer.send(args.receiver, subject, render(type, args));
    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.loggerService.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.loggerService.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.loggerService.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
}
