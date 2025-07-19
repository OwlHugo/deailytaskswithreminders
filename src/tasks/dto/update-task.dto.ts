import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTaskDTO } from './create-task.dto';
import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @ApiPropertyOptional({
    description: 'Título da tarefa',
    example: 'Reunião diária atualizada',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Reunião de alinhamento com a equipe atualizada',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Horário de execução no formato HH:MM',
    example: '10:00',
    pattern: '^([01]?[0-9]|2[0-3]):([0-5][0-9])$',
  })
  executionTime?: string;

  @ApiPropertyOptional({
    description: 'URL do webhook que será chamado no horário agendado',
    example: 'https://api.exemplo.com/webhook/novo',
  })
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'ID do usuário proprietário da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Timezone do usuário',
    example: 'America/Sao_Paulo',
    default: 'UTC',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-z_]+\/[A-Za-z_]+$/, {
    message: 'Timezone deve estar no formato Continent/City',
  })
  timezone?: string;
}