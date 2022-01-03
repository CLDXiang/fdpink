import { IsString, IsInt, Min, Max, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRateDto {
  @ApiPropertyOptional({
    description: '课程难度',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @ApiPropertyOptional({
    description: '课程工作量',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  workload?: number;

  @ApiPropertyOptional({
    description: '课程给分情况',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  nice?: number;

  @ApiPropertyOptional({
    description: '课程推荐度',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  recommended?: number;

  @ApiPropertyOptional({
    description: '评价',
    example: '庭院深深深几许，我要谢谢谢锡麟',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40940)
  content?: string;
}
