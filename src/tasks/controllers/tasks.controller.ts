import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { UpdateTaskDTO } from '../dto/update-task.dto';
import { TaskResponseDTO } from '../dto/task-response.dto';
import { CreateTaskCommand } from '../commands/create-task.command';
import { GetTasksQuery } from '../queries/get-tasks.query';
import { GetTaskByIdQuery } from '../queries/get-task-by-id.query';
import { UpdateTaskCommand } from '../commands/update-task.command';
import { DeleteTaskCommand } from '../commands/delete-task.command';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova tarefa',
    description: 'Cria uma nova tarefa diária com webhook agendado',
  })
  @ApiBody({
    type: CreateTaskDTO,
    description: 'Dados da tarefa a ser criada',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tarefa criada com sucesso',
    type: TaskResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async create(@Body() createTaskDTO: CreateTaskDTO): Promise<TaskResponseDTO> {
    return await this.commandBus.execute(
      new CreateTaskCommand(
        createTaskDTO.title,
        createTaskDTO.description,
        createTaskDTO.executionTime,
        createTaskDTO.webhookUrl,
        createTaskDTO.userId,
        createTaskDTO.timezone,
      ),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar tarefas do usuário',
    description: 'Retorna todas as tarefas ativas de um usuário específico',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de tarefas retornada com sucesso',
    type: [TaskResponseDTO],
  })
  async findAll(@Query('userId') userId: string): Promise<TaskResponseDTO[]> {
    return await this.queryBus.execute(new GetTasksQuery(userId));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar tarefa por ID',
    description: 'Retorna uma tarefa específica pelo ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarefa encontrada com sucesso',
    type: TaskResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tarefa não encontrada',
  })
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<TaskResponseDTO> {
    return await this.queryBus.execute(new GetTaskByIdQuery(id, userId));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar tarefa',
    description: 'Atualiza uma tarefa existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTaskDTO,
    description: 'Dados da tarefa a ser atualizada',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarefa atualizada com sucesso',
    type: TaskResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tarefa não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Query('userId') userId: string,
  ): Promise<TaskResponseDTO> {
    return await this.commandBus.execute(
      new UpdateTaskCommand(
        id,
        updateTaskDTO.title,
        updateTaskDTO.description,
        updateTaskDTO.executionTime,
        updateTaskDTO.webhookUrl,
        userId,
        updateTaskDTO.timezone,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar tarefa',
    description: 'Remove uma tarefa existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tarefa deletada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tarefa não encontrada',
  })
  async remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return await this.commandBus.execute(new DeleteTaskCommand(id, userId));
  }
}
