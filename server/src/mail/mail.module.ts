import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from 'src/entities/mail';
import { MAILGUN_DOMAIN, MAIL_QUEUE_TPS, REDIS_HOST, REDIS_PASS, REDIS_PORT } from 'src/utils/config';
import { MailService, VERIFICATION_QUEUE } from './mail.service';
import { MailProcessor, MAILERS_TOKEN } from './mail.processor';
import { Mailer } from './mailer';
import * as mg from 'nodemailer-mailgun-transport';
import { createTransport } from 'nodemailer';
import { MAILGUN_APIKEY } from '../utils/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mail], 'default'),
    BullModule.registerQueue({
      name: VERIFICATION_QUEUE,
      limiter: {
        max: MAIL_QUEUE_TPS,
        duration: 1000,
      },
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASS,
      },
    }),
  ],
  providers: [
    MailService,
    MailProcessor,
    {
      provide: MAILERS_TOKEN,
      // add mailer transport here, we don't use config because we might
      // have different transport supplier, which is hard to config.
      useValue: [
        new Mailer(
          createTransport(
            mg({
              auth: {
                api_key: MAILGUN_APIKEY,
                domain: MAILGUN_DOMAIN,
              },
            }),
          ),
          'noreply@mail.fdxk.info',
          1000,
          300,
        ),
      ],
    },
  ],
  exports: [TypeOrmModule, MailService, BullModule],
})
export class MailModule {}
