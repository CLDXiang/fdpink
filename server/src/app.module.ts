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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
