import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Task } from 'src/tasks/entities/task.entity';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendWebhook(task: Task, retryCount = 0): Promise<void> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 segundo

    try {
      const payload = {
        taskId: task.id,
        title: task.title,
        description: task.description,
        executionTime: task.executionTime,
        timestamp: new Date().toISOString(),
      };
      const headers = {
        'Content-Type': 'application/json',
        ...task.webhookHeaders,
      };
      await firstValueFrom(
        this.httpService.post(task.webhookUrl, payload, {
          timeout: 10000,
          headers,
        }),
      );

      this.logger.log(`Webhook enviado com sucesso para tarefa ${task.id}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar webhook para ${task.webhookUrl}: ${error.message}`,
      );

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        this.logger.log(`Tentativa ${retryCount + 1} em ${delay}ms`);

        setTimeout(() => {
          this.sendWebhook(task, retryCount + 1);
        }, delay);
      } else {
        this.logger.error(`Webhook falhou após ${maxRetries} tentativas`);
      }
    }
  }
}
