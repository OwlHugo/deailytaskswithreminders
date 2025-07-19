import { IsString, IsNotEmpty, IsUrl, Matches, ValidateIf, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDTO {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Reunião diária',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Reunião de alinhamento com a equipe',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Horário de execução no formato HH:MM',
    example: '09:00',
    pattern: '^([01]?[0-9]|2[0-3]):([0-5][0-9])$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'ExecutionTime deve estar no formato HH:MM',
  })
  executionTime: string;

  @ApiProperty({
    description: 'URL do webhook que será chamado no horário agendado',
    example: 'https://api.exemplo.com/webhook',
  })
  @IsUrl()
  @IsNotEmpty()
  webhookUrl: string;

  @ApiProperty({
    description: 'ID do usuário proprietário da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

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
