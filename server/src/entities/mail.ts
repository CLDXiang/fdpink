import { MailTemplateType } from 'src/mail/template';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  Pending = 'pending',
  Sent = 'sent',
  Activated = 'activated',
}

@Index('idx_email_status_code', ['email', 'status', 'code'])
@Entity('mail')
export class Mail {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', nullable: false, length: 64 })
  email: string;

  @Column({ type: 'enum', enum: Status, name: 'status', nullable: false, default: Status.Pending })
  status: Status;

  @Column({ type: 'enum', enum: MailTemplateType, name: 'type', nullable: false, default: MailTemplateType.Test })
  type: MailTemplateType;

  @Column('varchar', { name: 'code', nullable: false, length: 6 })
  code: string;

  @Column('datetime', { name: 'requested_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  requestedAt: Date;

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
}
