import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { TEST_MAIL } from 'src/utils/config';

export class GetUserInfoResponse {
  @ApiProperty({
    description: '用户 id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '用户名称',
    example: 'littleCry',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '用户邮箱',
    example: TEST_MAIL,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '用户昵称',
    example: '三教久留人',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '用户简介',
    example: '旦复旦兮，日月光华',
  })
  @IsString()
  bio: string;

  // @ApiProperty()
  // fans: number;

  // @ApiProperty()
  // watchers: number;

  // @ApiProperty()
  // watchees: number;
}
