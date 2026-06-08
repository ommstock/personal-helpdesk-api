import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import databaseConfig from 'src/config/database.config';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: databaseConfig.KEY,
          useValue: { url: 'mock-database-url' },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
