import { IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HistoryDto {
  @ApiProperty()
  @IsInt()
  historyAboutId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  type: string;
}
