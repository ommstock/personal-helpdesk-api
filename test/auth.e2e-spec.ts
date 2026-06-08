import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

describe('Auth and JWT (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = app.get<JwtService>(JwtService); // get JwtService instance
    });

    it('should reject access if token has expired', async () => {
        // 1. Sign expired token
        const expiredToken = jwtService.sign(
            { sub: 1, email: 'test@example.com', role: 'USER' },
            { expiresIn: '0s' }
        );

        // 2. Try access to protected route
        const response = await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${expiredToken}`);

        // 3. Expect 401 Unauthorized
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual('Unauthorized');
    });

    it('should use the expiration time configured in .env', async () => {
        jest.useFakeTimers();

        // 1. Sign without time (it will use the default configuration from .env)
        const token = jwtService.sign({ sub: 1, email: 'test@example.com', role: 'USER' });

        // 2. Verify that the token works at the beginning
        await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        // 3. Fast-forward 1 year
        jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 365);

        // 4. Should fail
        const response = await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);

        // Restore real timers
        jest.useRealTimers();
    });

    it('should allow access to protected route with a valid token', async () => {
        // 1. Sign a valid token (standard expiration)
        const token = jwtService.sign({ sub: 1, email: 'test@example.com', role: 'USER' });

        // 2. Access the protected route
        const response = await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${token}`);

        // 3. Expect 200 OK
        expect(response.status).toBe(200);
        // 4. Check user data
        expect(response.body).toHaveProperty('email', 'test@example.com');
    });


    afterAll(async () => {
        await app.close();
    });
});
