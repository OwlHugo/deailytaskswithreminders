import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTaskByIdQuery } from "../get-task-by-id.query";
import { Task } from "src/tasks/entities/task.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery>{
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ){}

    async execute(query: GetTaskByIdQuery): Promise<Task>{
        const task = await this.taskRepository.findOne({
            where: {
                id: query.id, 
                userId: query.userId,
                deletedAt: undefined,
            }
        });

        if(!task){
            throw new Error('Tarefa não encontrada');
        }

        return task;
    }
}