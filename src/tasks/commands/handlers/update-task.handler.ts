import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../update-task.command';
import { Task } from 'src/tasks/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly httpService: HttpService,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: command.id, userId: command.userId },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    if (command.executionTime && command.executionTime !== task.executionTime) {
      const existingTask = await this.taskRepository.findOne({
        where: {
          userId: command.userId,
          executionTime: command.executionTime,
          active: true,
          deletedAt: undefined,
          id: Not(command.id), 
        },
      });

      if (existingTask) {
        throw new Error('Já existe uma tarefa ativa com o mesmo horário');
      }
    }

    if (command.webhookUrl && command.webhookUrl !== task.webhookUrl) {
      await this.validateWebhookUrl(command.webhookUrl);
    }

    Object.assign(task, {
      ...(command.title && { title: command.title }),
      ...(command.description !== undefined && { description: command.description }),
      ...(command.executionTime && { executionTime: command.executionTime }),
      ...(command.webhookUrl && { webhookUrl: command.webhookUrl }),
      ...(command.timezone && { timezone: command.timezone }),
    });
    return await this.taskRepository.save(task);
  }

  private async validateWebhookUrl(url: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.head(url, {
          timeout: 5000,
        }),
      );
      return true;
    } catch (error) {
      throw new Error('URL do webhook não é acessível');
    }
  }
}
