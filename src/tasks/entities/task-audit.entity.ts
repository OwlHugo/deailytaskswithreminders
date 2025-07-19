import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('task_audits')
export class TaskAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id' })
  taskId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  action: string; 

  @Column({ type: 'jsonb', nullable: true })
  changes: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}