import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConfigType } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor(
        @Inject(databaseConfig.KEY) private dbConfig: ConfigType<typeof databaseConfig>,
    ) {
        super({
            adapter: new PrismaPg({
                connectionString: dbConfig.url,
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
