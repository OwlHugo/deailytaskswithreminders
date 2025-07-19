import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TasksController } from './controllers/tasks.controller';
import { CreateTaskHandler } from './commands/handlers/create-task.handler';
import { UpdateTaskHandler } from './commands/handlers/update-task.handler';
import { DeleteTaskHandler } from './commands/handlers/delete-task.handler';
import { GetTasksHandler } from './queries/handlers/get-tasks.handler';
import { GetTaskByIdHandler } from './queries/handlers/get-task-by-id.handler';
import { TaskCreatedHandler } from './events/handlers/task-created.handler';
import { TaskReminderHandler } from './events/handlers/task-reminder.handler';
import { HttpModule } from '@nestjs/axios';

const CommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
];

const QueryHandlers = [GetTasksHandler, GetTaskByIdHandler];

const EventHandlers = [TaskCreatedHandler, TaskReminderHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CqrsModule,
    HttpModule,
  ],
  controllers: [TasksController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
  exports: [TypeOrmModule],
})
export class TasksModule {}
