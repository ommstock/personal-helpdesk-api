import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';

import { AuditAction, EntityType } from 'src/common/enums/audit.enum';

export interface AuditEventPayload {
  action: AuditAction;
  entity: EntityType;
  entityId: string;
  userId: string;
  oldValue?: any;
  newValue?: any;
}

@Injectable()
export class AuditEventListener {
  private readonly logger = new Logger(AuditEventListener.name);

  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditClient: ClientProxy,
  ) { }

  @OnEvent('audit.log.record')
  handleAuditLogEvent(payload: AuditEventPayload) {
    this.logger.debug(`Audit domain event captured. Emitting to RabbitMQ...`);
    try {
      this.auditClient.emit('audit.log.record', payload);
    } catch (error) {
      this.logger.error('Error emitting audit event to RabbitMQ', error);
    }
  }
}
