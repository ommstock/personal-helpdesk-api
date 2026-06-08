import { Controller, Post, Body, HttpCode, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { AuthGuard } from './auth.guard';
import { Role } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Post('protected')
    protectedRoute(): Object | string {
        return { 'message': "Protected" };
    }

    @HttpCode(200)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin')
    adminRoute(): Object | string {
        return { 'message': "Admin Only" };
    }

    @HttpCode(200)
    @Post('public')
    publicRoute(): Object | string {
        return { 'message': "Public" };
    }

    @HttpCode(200)
    @Post('signin')
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signIn(signinDto);
    }

    @HttpCode(201)
    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }
}
