import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queue: process.env.RABBITMQ_QUEUE || 'audit_queue',
  durable: process.env.RABBITMQ_DURABLE ? process.env.RABBITMQ_DURABLE === 'true' : true,
}));
