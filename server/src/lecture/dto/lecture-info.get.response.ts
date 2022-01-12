import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray } from 'class-validator';

export class RelatedLectures {
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

export class LectureInfoResponse {
  @ApiProperty({
    description: '课程 id',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '课程代码',
    example: 'SOCI130085',
  })
  @IsString()
  code: string;

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

  @ApiProperty({
    description: '其他老师开设的该课程',
    example: [
      { id: 1, name: '中国文化与商业实践', teachers: '潘天舒', semester: '2021春' },
      { id: 1, name: '中国文化与商业实践', teachers: '潘天舒', semester: '2021春' },
    ],
    type: [RelatedLectures],
  })
  @IsArray()
  LecturesWithSameName: RelatedLectures[];

  @ApiProperty({
    description: '当前老师开设的其他课程',
    example: [
      { id: 1, name: '中国文化与商业实践', teachers: '潘天舒', semester: '2021春' },
      { id: 1, name: '中国文化与商业实践', teachers: '潘天舒', semester: '2021春' },
    ],
    type: [RelatedLectures],
  })
  @IsArray()
  LecturesWithSameInstructor: RelatedLectures[];
}
