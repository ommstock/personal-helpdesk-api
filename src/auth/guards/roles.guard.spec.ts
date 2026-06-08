import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('RolesGuard (Unit)', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new RolesGuard(reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if no roles are required', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should return false if user role is not in required roles', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: Role.USER } }),
            }),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockContext)).toBe(false);
    });

    it('should return true if user role is in required roles', () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: Role.ADMIN } }),
            }),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockContext)).toBe(true);
    });
});
