import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Rate } from '../entities/rate';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rate], 'default')],
  controllers: [UserController],
  providers: [UserService],
  // providers: [UserService, StorageService, FileService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
