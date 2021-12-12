import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PatchUserInfoRequest {
  @ApiPropertyOptional({
    description: '用户昵称',
    example: '三教久留人',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nickname?: string;

  @ApiPropertyOptional({
    description: '用户简介',
    example: '旦复旦兮，日月光华',
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  bio?: string;
}
