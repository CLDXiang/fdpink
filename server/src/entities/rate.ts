import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_lecture_id_user_id', ['lectureId', 'userId'], {})
@Index('idx_user_id', ['userId'], {})
@Entity('rate')
export class Rate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'lecture_id' })
  lectureId: number;

  @Column('int', { name: 'user_id' })
  userId: number;

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

  @Column('tinyint', {
    name: 'is_edited',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isEdited: boolean | null;

  @Column('tinyint', {
    name: 'is_deleted',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isDeleted: boolean | null;

  @Column('varchar', { name: 'deleted_by', nullable: true, length: 100 })
  deletedBy: string | null;

  @Column('int', { name: 'difficulty', nullable: true })
  difficulty: number | null;

  @Column('int', { name: 'workload', nullable: true })
  workload: number | null;

  @Column('int', { name: 'nice', nullable: true })
  nice: number | null;

  @Column('int', { name: 'recommended', nullable: true })
  recommended: number | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;
}
