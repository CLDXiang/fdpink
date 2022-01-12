import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { TYPEORM_CONFIG } from './utils/config';
import { WinstonModule } from 'nest-winston';
import { LOGGER_CONFIG } from './utils/logger';
import { LectureModule } from './lecture/lecture.module';
import { RateModule } from './rate/rate.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => TYPEORM_CONFIG,
    }),
    WinstonModule.forRootAsync({
      useFactory: () => LOGGER_CONFIG,
    }),
    AuthModule,
    UserModule,
    MailModule,
    RateModule,
    LectureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
