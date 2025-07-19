import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskCommand } from '../create-task.command';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskCreatedEvent } from 'src/tasks/events/task-created.event';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly eventBus: EventBus,
    private readonly httpService: HttpService,
  ) {}
  async execute(command: CreateTaskCommand): Promise<Task> {
    const userTaskCount = await this.taskRepository.count({
      where: {
        userId: command.userId,
        active: true,
      },
    });

    const maxTasksPerUser = 50; 
    if (userTaskCount >= maxTasksPerUser) {
      throw new Error('Limite máximo de tarefas atingido');
    }

    const existingTask = await this.taskRepository.findOne({
      where: {
        userId: command.userId,
        executionTime: command.executionTime,
        active: true,
      },
    });

    if (existingTask) {
      throw new Error('Já existe uma tarefa ativa com o mesmo horário');
    }

    await this.validateWebhookUrl(command.webhookUrl);

    const task = this.taskRepository.create({
      title: command.title,
      description: command.description,
      executionTime: command.executionTime,
      webhookUrl: command.webhookUrl,
      userId: command.userId,
      timezone: command.timezone || 'UTC',
    });

    const savedTask = await this.taskRepository.save(task);
    this.eventBus.publish(new TaskCreatedEvent(savedTask));

    return savedTask;
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
