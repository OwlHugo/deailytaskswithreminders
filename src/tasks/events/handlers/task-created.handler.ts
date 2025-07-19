import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskCreatedEvent } from '../task-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedHandler implements IEventHandler<TaskCreatedEvent> {
  private readonly logger = new Logger(TaskCreatedHandler.name);

  handle(event: TaskCreatedEvent) {
    this.logger.log(`Tarefa criada: ${event.task.title} - ${event.task.executionTime}`);
  }
}