import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SucceedDto {
  @ApiProperty({
    description: '回复',
    example: '1.验证码已发送至您的邮箱中请注意查收 2.验证成功 3.注册成功 4.邮箱重置成功 5.密码重置成功',
  })
  @IsString()
  message: string;
}
