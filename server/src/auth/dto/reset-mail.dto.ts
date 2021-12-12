import { IsString, MaxLength, IsNumber, Min, Max, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TEST_MAIL } from '../../utils/config';

export class ResetMailDto {
  @ApiProperty({
    description: '验证码',
    example: 123456,
  })
  @IsNumber()
  @Min(100000, { message: '验证码需不低于 100000' })
  @Max(999999, { message: '验证码需不超过 999999' })
  code: number;

  @ApiProperty({
    description: '老邮箱',
    example: TEST_MAIL,
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  oldEmail: string;

  @ApiProperty({
    description: '新邮箱',
    example: 'pink0@fdpink.com',
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  newEmail: string;
}
