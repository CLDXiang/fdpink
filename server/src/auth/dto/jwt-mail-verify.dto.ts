import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class JwtMailVerifyDto {
  @ApiProperty({
    description: '验证码',
    example: 123456,
  })
  @IsNumber()
  @Min(100000, { message: '验证码需不低于 100000' })
  @Max(999999, { message: '验证码需不超过 999999' })
  code: number;
}
