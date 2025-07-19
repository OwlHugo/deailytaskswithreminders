import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { TasksModule } from './tasks/tasks.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TasksModule,
    WebhooksModule,
    SchedulerModule,
  ],
})
export class AppModule {}