import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDTO {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Reunião diária',
  })
  title: string;

  @ApiProperty({
    description: 'Descrição da tarefa',
    example: 'Reunião de alinhamento com a equipe',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Horário de execução',
    example: '09:00',
  })
  executionTime: string;

  @ApiProperty({
    description: 'URL do webhook',
    example: 'https://api.exemplo.com/webhook',
  })
  webhookUrl: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Status ativo da tarefa',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data da última execução',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  lastExecutionDate: Date;

  @ApiProperty({
    description: 'Número de execuções',
    example: 5,
  })
  executionCount: number;

  @ApiProperty({
    description: 'Timezone da tarefa',
    example: 'America/Sao_Paulo',
  })
  timezone: string;

  @ApiProperty({
    description: 'Headers customizados do webhook',
    example: { 'Authorization': 'Bearer token' },
    nullable: true,
  })
  webhookHeaders: Record<string, string>;

  @ApiProperty({
    description: 'Data de exclusão',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  deletedAt: Date;
}