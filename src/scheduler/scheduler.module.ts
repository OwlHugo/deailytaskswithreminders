import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './services/task-scheduler.service';
import { Task } from 'src/tasks/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksModule } from 'src/webhooks/webhooks.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Task]),
    WebhooksModule,
  ],
  providers: [TaskSchedulerService],
})
export class SchedulerModule {}
