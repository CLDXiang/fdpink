import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SucceedDto {
  @ApiProperty({
    description: '回复',
    example: '1.创建评论成功 2.删除评论成功',
  })
  @IsString()
  message: string;
}
