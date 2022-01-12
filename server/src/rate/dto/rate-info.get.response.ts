import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsInt, Max, MaxLength, Min, MinLength, IsObject } from 'class-validator';

export class Lecture {
  @ApiProperty({
    description: '课程 id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '课程名',
    example: '中国文化与商业实践',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '课程分类',
    example: '社政专业',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: '授课教师列表',
    example: '潘天舒',
  })
  @IsString()
  teachers: string;
}

export class RateForm {
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

export class Creator {
  @ApiProperty({
    description: '用户 id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '用户昵称',
    example: '三教久留人',
  })
  @IsString()
  nickname: string;
}

export class RateInfoResponse {
  @ApiProperty({
    description: '评论 id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '评论创建时间',
    example: '2022-01-12 14:52:07',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '评论更新时间',
    example: '2022-01-12 14:52:07',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: '评课学期',
    example: '2021春',
  })
  @IsString()
  semester: string;

  @ApiProperty({
    description: '课程分类',
    example: '社政专业',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: '评论内容',
    example: { difficulty: 3, workload: 3, nice: 3, recommended: 3, content: '庭院深深深几许，我要谢谢谢锡麟' },
    type: RateForm,
  })
  @IsObject()
  form: RateForm;

  @ApiPropertyOptional({
    description: '创建者',
    example: { id: 1, nickname: '三教久留人' },
    type: Creator,
  })
  @IsObject()
  creator?: Creator;

  @ApiPropertyOptional({
    description: '课程',
    example: { id: 1, name: '中国文化与商业实践', category: '社政专业', teachers: '潘天舒' },
    type: Lecture,
  })
  @IsObject()
  lecture?: Lecture;
}
