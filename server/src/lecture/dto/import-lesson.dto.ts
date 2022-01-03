import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';

class TimeSlot {
  @ApiProperty({
    description: '星期几，1 对应星期一',
    example: 4,
  })
  @IsNumber()
  @Min(1, { message: '星期一' })
  @Max(7, { message: '星期天' })
  weekDay: number;

  @ApiProperty({
    description: '开始课时，从 1 开始',
    example: 2,
  })
  @IsNumber()
  @Min(1, { message: '第一节课' })
  @Max(14, { message: '最后一节课' })
  startUnit: number;

  @ApiProperty({
    description: '结束课时，从 1 开始',
    example: 5,
  })
  @IsNumber()
  @Min(1, { message: '第一节课' })
  @Max(14, { message: '最后一节课' })
  endUnit: number;

  @ApiProperty({
    description: '上课地点',
    example: 'HGX406',
  })
  @IsString()
  rooms: string;

  @ApiProperty({
    description: '上课周语义描述',
    example: '1-2',
  })
  @IsString()
  weekStateDigest: string;
}

export class ImportLessonDto {
  @ApiProperty({
    description: '课程唯一 ID',
    example: 591749,
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
    description: '课程序号',
    example: 'SOCI130085.01',
  })
  @IsString()
  no: string;

  @ApiProperty({
    description: '开课学期',
    example: '2015-2016学年暑期学期',
  })
  @IsString()
  semester: string;

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
    description: '学分',
    example: 2,
  })
  @IsNumber()
  credits: number;

  @ApiProperty({
    description: '开课院系',
    example: '社会发展与公共政策学院',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: '校区名称',
    example: '邯郸校区',
  })
  @IsString()
  campusName: string;

  @ApiProperty({
    description: '备注',
    example: '全英文课程\n7月4日到7月15日',
  })
  @IsString()
  remark: string;

  @ApiProperty({
    description: '考试类型名称',
    example: '论文',
  })
  @IsString()
  examFormName: string;

  @ApiProperty({
    description: '考试时间',
    example: '2016-08-02 13:30~2016-08-02 15:30',
  })
  @IsString()
  examTime: string;

  @ApiProperty({
    description: '是否允许期中退课',
    example: false,
  })
  @IsBoolean()
  withdrawable: boolean;

  @ApiProperty({
    description: '排课时间段',
    example: [
      { weekDay: 4, startUnit: 2, endUnit: 5, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 3, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 2, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 1, startUnit: 2, endUnit: 4, rooms: 'HGX406', weekStateDigest: '1-2' },
      { weekDay: 1, startUnit: 6, endUnit: 7, rooms: 'HGX406', weekStateDigest: '1-2' },
    ],
    type: [TimeSlot],
  })
  @IsArray()
  arrangeInfo: TimeSlot[];

  @ApiProperty({
    description: '选课人数上限',
    example: 30,
  })
  @IsNumber()
  maxStudent: number;

  @ApiProperty({
    description: '授课教师列表',
    example: '潘天舒',
  })
  @IsString()
  teachers: string;
}
