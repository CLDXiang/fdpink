import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsEmail, IsEnum } from 'class-validator';
import { MailTemplateType } from 'src/mail/template';
import { TEST_MAIL } from '../../utils/config';

export class MailDto {
  @ApiProperty({
    description: '验证邮箱',
    example: TEST_MAIL,
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: '邮件类型',
    example: MailTemplateType.Test,
  })
  @IsString()
  @IsEnum(MailTemplateType, { message: '邮件类型不支持' })
  type: MailTemplateType;
}
