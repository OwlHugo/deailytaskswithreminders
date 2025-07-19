export class UpdateTaskCommand {
    constructor(
      public readonly id: string,
      public readonly title?: string,
      public readonly description?: string,
      public readonly executionTime?: string,
      public readonly webhookUrl?: string,
      public readonly userId?: string,
      public readonly timezone?: string,
    ) {}
  }