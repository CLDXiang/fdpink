import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uk_name_department', ['name', 'department'], { unique: true })
@Entity('instructor')
export class Instructor {
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

  @Column('varchar', { name: 'department', nullable: false, length: 64 })
  department: string;

  @Column('varchar', { name: 'name', nullable: false, length: 64 })
  name: string;
}
