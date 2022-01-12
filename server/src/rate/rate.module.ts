import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from '../entities/rate';
import { Lecture } from '../entities/lecture';

@Module({
  imports: [TypeOrmModule.forFeature([Rate, Lecture]), UserModule],
  providers: [RateService],
  controllers: [RateController],
  exports: [RateService, TypeOrmModule],
})
export class RateModule {}
