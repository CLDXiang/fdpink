import * as winston from 'winston';
import { FixedCapQueue } from 'src/utils/queue';
import { SendMailOptions } from 'nodemailer';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// we use an exponential backoff strategy
const BACKOFF_INTERVAL: number[] = [0, 100, 200, 400, 800, 1600, 3200, 6400, 12800];
export const HOUR_IN_MS = 60 * 60 * 1000;
export const DAY_IN_MS = HOUR_IN_MS * 24;

export interface MailTransport {
  sendMail(opt: SendMailOptions): Promise<unknown>;
}

export class Mailer {
  private readonly logger = winston.loggers.get('customLogger');

  private bo = 0;

  private dayRecord: FixedCapQueue<number>;

  private hourRecord: FixedCapQueue<number>;

  private lastSend: Date;

  private nextSend: number;

  constructor(
    private readonly transport: MailTransport,
    private readonly sender: string,
    private readonly maxPerDay: number = 0,
    private readonly maxPerHour: number = 0,
  ) {
    this.lastSend = new Date();
    this.dayRecord = new FixedCapQueue(maxPerDay);
    this.hourRecord = new FixedCapQueue(maxPerHour);
    this.nextSend = this.lastSend.getTime();
  }

  async send(receiver: string, subject: string, content: string) {
    this.logger.debug(`${this.sender} is sending`);
    const now = new Date();
    const ts = now.getTime();
    const wait = this.nextSend - ts;
    if (wait > 50) {
      // if diff is less than 50, we don't bother waiting
      await sleep(wait);
    }
    try {
      await this.transport.sendMail({
        from: this.sender,
        to: receiver,
        subject,
        html: content,
      });
    } catch (e) {
      this.bo += 1;
      if (this.bo === BACKOFF_INTERVAL.length) {
        this.bo -= 1;
      }
      this.nextSend = Math.max(this.nextSend, ts + BACKOFF_INTERVAL[this.bo]);
      throw e;
    }
    this.lastSend = now;
    if (this.bo !== 0) {
      this.bo -= 1;
    }
    this.nextSend = Math.max(this.nextSend, ts + BACKOFF_INTERVAL[this.bo]);

    while (!this.dayRecord.empty() && this.dayRecord.front() + DAY_IN_MS < ts) {
      this.dayRecord.popFront();
    }
    while (!this.hourRecord.empty() && this.hourRecord.front() + HOUR_IN_MS < ts) {
      this.hourRecord.popFront();
    }

    this.hourRecord.pushBack(ts);
    this.dayRecord.pushBack(ts);

    if (this.hourRecord.size() === this.maxPerHour) {
      this.nextSend = Math.max(this.nextSend, this.hourRecord.front() + HOUR_IN_MS + 50);
    }

    if (this.dayRecord.size() === this.maxPerDay) {
      this.nextSend = Math.max(this.nextSend, this.dayRecord.front() + DAY_IN_MS + 50);
    }

    this.logger.debug(`next send at ${new Date(this.nextSend).toTimeString()}`);
  }

  // nextReady returns the approximated next timestamp for sending
  nextReady(): number {
    return this.nextSend;
  }
}
