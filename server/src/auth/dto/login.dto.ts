import { IsString, MinLength, MaxLength, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '登陆用户名或邮箱',
    example: 'pink',
  })
  @IsString()
  @IsAlphanumeric()
  @MinLength(1, { message: '用户名太短啦！至少 1 个字符哦！' })
  @MaxLength(30, { message: '用户名太长啦！最多 30 个字符哦！' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: 'fdupink',
  })
  @IsString()
  @MinLength(6, { message: '密码太短啦！至少 6 个字符哦！' })
  @MaxLength(32, { message: '密码太长啦！最多 32 个字符哦！' })
  password: string;
}
