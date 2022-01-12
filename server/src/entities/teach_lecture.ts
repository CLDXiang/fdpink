import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('idx_lecture_id', ['lectureId'])
@Entity('teach_lecture')
export class TeachLecture {
  @PrimaryColumn({ type: 'int', name: 'instructor_id' })
  instructorId: number;

  @PrimaryColumn({ name: 'lecture_id', type: 'int' })
  lectureId: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
