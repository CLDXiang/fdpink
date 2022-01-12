import { IsString, IsInt, Min, Max, MinLength, MaxLength, IsNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @see usage of class-validation https://github.com/typestack/class-validator#usage
 */
export class CreateRateDto {
  @ApiProperty({
    description: '课程号',
    example: 123,
  })
  @IsNumber()
  lectureId: number;

  @ApiProperty({
    description: '课程难度',
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;

  @ApiProperty({
    description: '课程工作量',
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  workload: number;

  @ApiProperty({
    description: '课程给分情况',
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  nice: number;

  @ApiProperty({
    description: '开课学期',
    example: '2021春',
  })
  @Matches(/\d{4}(春|秋|暑期)/)
  @IsString()
  semester: string;

  @ApiProperty({
    description: '课程推荐度',
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  recommended: number;

  @ApiProperty({
    description: '评价',
    example: '庭院深深深几许，我要谢谢谢锡麟',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(40940)
  content: string;
}
