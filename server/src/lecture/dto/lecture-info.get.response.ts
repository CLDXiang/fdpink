import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray } from 'class-validator';

class RelatedLectures {
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

  taughtBy: string[];

  @ApiProperty({
    description: '学分',
    example: 2,
  })
  @IsNumber()
  credit: number;

  @ApiProperty({
    description: '开课院系',
    example: '社会发展与公共政策学院',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: '其他老师开设的该课程',
    example: [
      { weekDay: 1, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 1, startUnit: 6, endUnit: 7, rooms: 'HGX406', weekStateDigest: '1-2' },
    ],
    type: [RelatedLectures],
  })
  @IsArray()
  LecturesWithSameName: RelatedLectures[];

  @ApiProperty({
    description: '当前老师开设的其他课程',
    example: [
      { weekDay: 3, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 2, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
    ],
    type: [RelatedLectures],
  })
  @IsArray()
  LecturesWithSameInstructor: RelatedLectures[];
}
