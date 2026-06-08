import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConfigType } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { Inject } from '@nestjs/common';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(databaseConfig.KEY) private dbConfig: ConfigType<typeof databaseConfig>
    ) {

        super({
            adapter: new PrismaPg({
                connectionString: dbConfig.url,
            }),
        });

        //     const pool = new Pool({ connectionString: env('DATABASE_URL') });
        //     const adapter = new PrismaPg(pool);
        //     super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
