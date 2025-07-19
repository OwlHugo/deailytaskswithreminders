import { Task } from '../entities/task.entity';

export class TaskReminderEvent {
  constructor(public readonly task: Task) {}
}
