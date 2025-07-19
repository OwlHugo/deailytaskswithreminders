import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './services/webhook.service';

@Module({
  imports: [HttpModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
