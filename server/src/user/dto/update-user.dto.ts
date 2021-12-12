import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  nickName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  bio: string;
}
