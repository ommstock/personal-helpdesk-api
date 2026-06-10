import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_GLOBAL_TTL || '60000', 10),
  ticketsTtl: parseInt(process.env.CACHE_TICKETS_TTL || '10000', 10),
}));
