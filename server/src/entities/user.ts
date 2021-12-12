import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  UnActivated = 'unactivated',
  Activated = 'activated',
  Supervisor = 'supervisor',
}

@Index('uk_email', ['email'], { unique: true })
@Index('uk_name', ['name'], { unique: true })
@Index('idx_nickName', ['nickName'])
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'email', length: 64 })
  email: string;

  @Column('char', { name: 'saltedPassword', length: 145 })
  saltedPassword: string;

  @Column('varchar', { name: 'nickName', nullable: true, length: 30 })
  nickName: string | null;

  @Column('varchar', { name: 'bio', nullable: true, length: 128 })
  bio: string | null;

  @Column({ type: 'enum', enum: RoleType, name: 'role', nullable: false, default: RoleType.UnActivated })
  role: RoleType;

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
