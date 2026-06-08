import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { Roles } from '../src/auth/decorators/roles.decorator';
import { CurrentUser } from '../src/auth/decorators/current-user.decorator';
import { AuthGuard } from '../src/auth/auth.guard';
import { Role } from '@prisma/client';
import request from 'supertest';

// 1. Create a "Dummy" controller that ONLY exists during this test.
// This isolates the test from production infrastructure.
@Controller('test-decorators')
class TestController {
    // Returns the injected user from the decorator
    @Get('current-user')
    @UseGuards(AuthGuard)
    testCurrentUser(@CurrentUser() user: any) {
        return user;
    }

    // Tests AuthGuard + RolesGuard + @Roles combination
    @Get('admin-only')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    testRoles() {
        return { success: true };
    }
}

describe('Test Controller & Decorators (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [TestController], // <--- Inject TestController dynamically
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = app.get<JwtService>(JwtService);
    });

    describe('@CurrentUser Decorator', () => {
        it('should inject user payload into route parameter', async () => {
            const mockUserPayload = { sub: 99, email: 'inyectado@test.com', role: 'USER' };
            const token = jwtService.sign(mockUserPayload);

            const response = await request(app.getHttpServer())
                .get('/test-decorators/current-user')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            // Verify decorator extracted the correct email
            expect(response.body).toHaveProperty('email', 'inyectado@test.com');
            expect(response.body).toHaveProperty('sub', 99);
        });
    });

    describe('@Roles Decorator + RolesGuard', () => {
        it('should protect dynamic route for users without ADMIN role', async () => {
            const token = jwtService.sign({ sub: 1, email: 'user@test.com', role: 'USER' });

            const response = await request(app.getHttpServer())
                .get('/test-decorators/admin-only')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body.error).toEqual('Forbidden');
        });

        it('should allow access to dynamic route if user has ADMIN role', async () => {
            const token = jwtService.sign({ sub: 2, email: 'admin@test.com', role: 'ADMIN' });

            const response = await request(app.getHttpServer())
                .get('/test-decorators/admin-only')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
