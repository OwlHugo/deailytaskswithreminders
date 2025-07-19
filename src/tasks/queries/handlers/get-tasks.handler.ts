import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetTasksQuery } from '../get-tasks.query';
import { Task } from 'src/tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetTasksQuery)
export class GetTasksHandler implements IQueryHandler<GetTasksQuery> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async execute(query: GetTasksQuery): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { 
        userId: query.userId, 
        active: true,
        deletedAt: undefined,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
