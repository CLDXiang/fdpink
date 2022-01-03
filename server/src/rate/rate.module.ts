import { Module } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
// import { ReactService } from 'src/react/react.service';
import { DraftService } from 'src/rate_draft/rate_draft.service';
import { UserModule } from 'src/user/user.module';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
// import { NoticeService } from 'src/notice/notice.service';

@Module({
  imports: [UserModule],
  providers: [RateService, DraftService, StorageService],
  controllers: [RateController],
})
export class RateModule {}
