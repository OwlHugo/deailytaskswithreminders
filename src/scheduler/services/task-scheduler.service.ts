import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { WebhookService } from '../../webhooks/services/webhook.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Like } from 'typeorm';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly webhookService: WebhookService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTaskReminders() {
    const now = new Date();
    
    const tasks = await this.taskRepository.find({
      where: {
        active: true,
        deletedAt: undefined,
      },
    });

    for (const task of tasks) {
      const userTime = this.convertToUserTimezone(now, task.timezone);
      const currentTime = `${userTime.getHours().toString().padStart(2, '0')}:${userTime.getMinutes().toString().padStart(2, '0')}`;
      
      if (task.executionTime === currentTime) {
        const today = new Date().toDateString();
        const lastExecution = task.lastExecutionDate?.toDateString();
        
        if (lastExecution !== today) {
          this.logger.log(`Enviando lembrete para tarefa ${task.id}`);
          await this.webhookService.sendWebhook(task);
          
          task.lastExecutionDate = now;
          task.executionCount += 1;
          await this.taskRepository.save(task);
        }
      }
    }
  }

  private convertToUserTimezone(date: Date, timezone: string): Date {
    try {
      return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    } catch (error) {
      this.logger.warn(`Timezone inválido: ${timezone}, usando UTC`);
      return date;
    }
  }
}
