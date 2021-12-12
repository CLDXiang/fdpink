import { IsString, MaxLength, IsNumber, Min, Max, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TEST_MAIL } from '../../utils/config';

export class ResetPasswordDto {
  @ApiProperty({
    description: '验证码',
    example: 123456,
  })
  @IsNumber()
  @Min(100000, { message: '验证码需不低于 100000' })
  @Max(999999, { message: '验证码需不超过 999999' })
  code: number;

  @ApiProperty({
    description: '密码',
    example: 'fdupink',
  })
  @IsString()
  @MinLength(6, { message: '密码太短啦！至少 6 个字符哦！' })
  @MaxLength(32, { message: '密码太长啦！最多 32 个字符哦！' })
  password: string;

  @ApiProperty({
    description: '邮箱',
    example: TEST_MAIL,
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;
}
