import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LecturesSearchResponse {
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

  @ApiProperty({
    description: '开课学期',
    example: '2021春',
  })
  @IsString()
  semester: string;
}
