import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uk_code_taught_by', ['code', 'teachers'], { unique: true })
@Index('idx_category', ['category'])
@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

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

  @Column('varchar', { name: 'code', nullable: false, length: 15 })
  code: string;

  @Column('varchar', { name: 'teachers', nullable: true, length: 512 })
  teachers: string | null;

  @Column('varchar', { name: 'name', nullable: false, length: 128 })
  name: string;

  @Column('varchar', { name: 'category', nullable: false, length: 32 })
  category: string;

  @Column('varchar', { name: 'semester', nullable: false, length: 512 })
  semester: string;
}
