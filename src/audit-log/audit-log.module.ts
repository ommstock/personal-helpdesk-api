import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuditEventListener } from './audit-event.listener';
import rmqConfig from 'src/config/rmq.config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUDIT_SERVICE',
        imports: [ConfigModule.forFeature(rmqConfig)],
        inject: [rmqConfig.KEY],
        useFactory: (config: ConfigType<typeof rmqConfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.url],
            queue: config.queue,
            queueOptions: {
              durable: config.durable,
            },
          },
        }),
      },
    ]),
  ],
  providers: [AuditEventListener],
  exports: [ClientsModule],
})
export class AuditLogModule { }
