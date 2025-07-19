import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskReminderEvent } from '../task-reminder.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TaskReminderEvent)
export class TaskReminderHandler implements IEventHandler<TaskReminderEvent> {
  private readonly logger = new Logger(TaskReminderHandler.name);

  handle(event: TaskReminderEvent) {
    this.logger.log(`Lembrete disparado para tarefa: ${event.task.title}`);
  }
}