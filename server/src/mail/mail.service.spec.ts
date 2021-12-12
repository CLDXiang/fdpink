import { Test, TestingModule } from '@nestjs/testing';
import { MailService, MAX_PENDING_INTERVAL, VERIFICATION_QUEUE } from './mail.service';
import { MailTemplateType } from './template';
import { Mail } from '../entities/mail';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerModule } from 'src/utils/logger';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { REDIS_HOST, REDIS_PASS, REDIS_PORT } from 'src/utils/config';
import { Queue } from 'bull';
import { SendMailOptions } from 'nodemailer';
import { Mailer, HOUR_IN_MS } from './mailer';

describe('MailService', () => {
  let service: MailService;
  let mailRepo: Repository<Mail>;
  let queue: Queue;
  const fakeProcessor = jest.fn();

  beforeAll(async () => {
    storage = newTestStorage('mail');
    const ormConn = await createAllTables(storage);
    mailRepo = ormConn.getRepository(Mail);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        BullModule.registerQueue({
          // we used the same queue name for testing, because I have no idea how to mock the processor class without duplicating the code
          name: VERIFICATION_QUEUE,
          limiter: {
            // for test purpose, we use larger tps, since we will be using mocked mail processor
            max: 300,
            duration: 1000,
          },
          redis: {
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASS,
          },
          processors: [fakeProcessor],
        }),
      ],
      providers: [MailService, { provide: getRepositoryToken(Mail, 'default'), useValue: mailRepo }],
    }).compile();

    service = module.get<MailService>(MailService);
    queue = module.get<Queue>(getQueueToken(VERIFICATION_QUEUE));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queue).toBeDefined();
  });

  it('should not retrieve data that is out of date', async (done) => {
    const now = new Date();
    let mail = new Mail();
    mail.code = '233333';
    mail.email = '1@a.com';
    mail.requestedAt = now;
    await mailRepo.save(mail);
    expect(await service.getValidMailNum(mail.email)).toBe(1);

    // we need to create a new Mail, otherwise mailRepo.save will use update instead of insert
    mail = new Mail();
    mail.code = '666666';
    mail.email = '1@a.com';
    mail.requestedAt = new Date(now.getTime() - MAX_PENDING_INTERVAL * 1000 - 1000);
    // this mail is now outdated, it should not be retrieved.
    await mailRepo.save(mail);
    expect(await service.getValidMailNum(mail.email)).toBe(1);
    done();
  });

  it('should be able to request verification', async (done) => {
    const testReceiver = 'test@test.org';
    await service.requestVerification(MailTemplateType.Test, testReceiver);
    const mails = await mailRepo.find({ email: testReceiver });
    expect(mails.length).toBe(1);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(fakeProcessor).toHaveBeenCalledTimes(1);
        resolve();
      }, 1);
    });
    done();
  });

  it('mailer should process mail jobs up to its limit', async (done) => {
    class MockedTransport {
      constructor(private readonly successRate: number) {}

      // override the sendMail method
      async sendMail(mailOptions: SendMailOptions) {
        return 'true';
      }
    }
    const mailer = new Mailer(new MockedTransport(0.9), 'noreply@fdxk.info', 100, 10);
    for (let i = 0; i < 10; i++) {
      await mailer.send('r', 's', 'c');
    }
    expect(mailer.nextReady()).toBeGreaterThan(new Date().getTime() + HOUR_IN_MS - 3000); // minus 3000 to avoid time jittering
    done();
  });

  /* since we don't know how to hook the processor, the following test is commented out until we discovered the solution.
  it('should limit the rate', async done => {
    for (let i = 0; i < 10; i++) {
      const job: SendMailJob = {
        type: MailTemplateType.Test,
        code: '233333',
        receiver: 'zfhu16@gmail.com',
      };
      await queue.add(job, {
        removeOnComplete: true,
        removeOnFail: false,
        backoff: { type: 'exponential' },
        attempts: 5,
      });
    }
    queue.process((job: Bull.Job<SendMailJob>) => {
      // tslint:disable-next-line: no-console
      console.log(`${JSON.stringify(job)}`);
    });

    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(fakeProcessor).toHaveBeenCalledTimes(10);
        resolve();
      }, 5000);
    });
    done();
  });
  */
});
