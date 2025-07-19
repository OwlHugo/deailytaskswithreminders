import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({
    description: 'Código do status HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Dados inválidos fornecidos',
  })
  message: string;

  @ApiProperty({
    description: 'Tipo do erro',
    example: 'Bad Request',
  })
  error: string;
}
