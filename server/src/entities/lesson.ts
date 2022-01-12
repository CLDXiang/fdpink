import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

interface TimeSlot {
  weekDay: number;
  startUnit: number;
  endUnit: number;
  rooms: string;
  weekStateDigest: string;
}

@Index('idx_code_taught_by', ['code', 'teachers'], {})
@Entity('lesson')
export class Lesson {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', {
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('varchar', { name: 'code', nullable: false, length: 15 })
  code: string;

  @Column('varchar', { name: 'code_full', nullable: false, length: 20 })
  codeFull: string;

  @Column('varchar', { name: 'semester', nullable: false, length: 20 })
  semester: string;

  @Column('varchar', { name: 'category', nullable: false, length: 32 })
  category: string;

  @Column('varchar', { name: 'teachers', nullable: true, length: 512 })
  teachers: string | null;

  @Column('varchar', { name: 'name', nullable: false, length: 128 })
  name: string;

  @Column({ name: 'credit', type: 'float' })
  credit: number;

  @Column('varchar', { name: 'department', nullable: false, length: 30 })
  department: string;

  @Column('varchar', { name: 'campus', nullable: false, length: 15 })
  campus: string;

  @Column('varchar', { name: 'remark', nullable: false, length: 512 })
  remark: string;

  @Column('varchar', { name: 'exam_type', nullable: false, length: 10 })
  examType: string;

  @Column('varchar', { name: 'exam_time', nullable: false, length: 128 })
  examTime: string;

  @Column('tinyint', {
    name: 'is_edited',
    nullable: false,
    width: 1,
    default: () => "'0'",
  })
  withdrawable: boolean;

  @Column('json', { name: 'time_slot', nullable: false })
  timeSlot: TimeSlot[];

  @Column({ name: 'max_student', type: 'int' })
  maxStudent: number;
}
