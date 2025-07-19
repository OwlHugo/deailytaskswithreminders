import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'execution_time' })
  executionTime: string;

  @Column({ name: 'webhook_url' })
  webhookUrl: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_execution_date', nullable: true })
  lastExecutionDate: Date;

  @Column({ name: 'execution_count', default: 0 })
  executionCount: number;

  @Column({ name: 'timezone', default: 'UTC' })
  timezone: string;

  @Column({ name: 'webhook_headers', type: 'jsonb', nullable: true })
  webhookHeaders: Record<string, string>;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
