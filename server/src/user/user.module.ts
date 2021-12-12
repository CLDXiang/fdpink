import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { StorageService } from '../storage/storage.service';
// import { FileService } from '../storage/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'default')],
  controllers: [UserController],
  providers: [UserService],
  // providers: [UserService, StorageService, FileService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
