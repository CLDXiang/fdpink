import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: '老密码',
    example: '123456',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: '新密码',
    example: '654321',
  })
  @IsString()
  @MaxLength(32, { message: '新密码太长啦！最多 32 个字符哦！' })
  @MinLength(6, { message: '新密码太短啦！至少 6 个字符哦！' })
  newPassword: string;
}
