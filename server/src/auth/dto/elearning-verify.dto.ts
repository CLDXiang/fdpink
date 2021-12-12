import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ElearningVerifyDto {
  @ApiProperty({
    description: 'Elearning token',
    example: 'dsaasas',
  })
  @IsString()
  @MaxLength(64)
  token: string;
}

export class ElearningRespondsDto {
  @ApiProperty({
    description: 'Elearning 验证返回值',
    example: '此处为学号',
  })
  @IsString()
  login_id: string;
}
