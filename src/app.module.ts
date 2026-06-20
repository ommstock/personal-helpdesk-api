import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoryModule } from './category/category.module';
import { CommentsModule } from './comments/comments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditLogModule } from './audit-log/audit-log.module';

import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';
import cacheConfig from './config/cache.config';
import rmqConfig from './config/rmq.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req: any) => req.headers['x-correlation-id'] || uuidv4(),
        // redact sensitive data
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.confirmPassword',
            'req.body.token',
          ],
          censor: '[REDACTED]',
        },
        // In dev uses pino-pretty, in prod uses raw JSON
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { singleLine: true } }
          : undefined,

        // skip for Kubernetes, AWS or Load Balancer (make too much noise)
        // autoLogging: {
        //   ignore: (req) => req.url === '/health', // skip health check
        // }
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig, cacheConfig, rmqConfig],
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    TicketsModule,
    CategoryModule,
    CommentsModule,
    DashboardModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
