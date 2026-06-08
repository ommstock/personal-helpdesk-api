import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

// Helper function to extract the factory function from a param decorator in NestJS
function getParamDecoratorFactory(decorator: Function) {
    class Test {
        public test(@decorator() value: any) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser Decorator (Unit)', () => {
    it('should extract the user object from the request', () => {
        // 1. Get decorator factory
        const factory = getParamDecoratorFactory(CurrentUser);

        const mockUser = { id: 1, email: 'test@example.com', role: 'ADMIN' };
        
        // 2. Mock ExecutionContext
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: mockUser,
                }),
            }),
        } as unknown as ExecutionContext;

        // 3. Execute factory
        const result = factory(null, mockContext);

        // 4. Assert result
        expect(result).toEqual(mockUser);
    });
});
