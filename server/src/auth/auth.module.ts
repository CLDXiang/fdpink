import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JWT_CONSTANT_SECRET } from '../utils/config';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UserModule,
    MailModule,
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
