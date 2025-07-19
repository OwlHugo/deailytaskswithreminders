import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../delete-task.command';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async execute(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: command.id, userId: command.userId },
    });
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    task.deletedAt = new Date();
    task.active = false;
    await this.taskRepository.save(task);
  }
}
