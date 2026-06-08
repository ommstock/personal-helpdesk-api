import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
import { SigninDto, SignupDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(signinDto: SigninDto) {
        const user = await this.userService.findByEmail(signinDto.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);

        const { password, ...result } = user;
        return { ...result, access_token: token }
    }

    async signup(signupDto: SignupDto) {
        const salt = await bcrypt.genSalt();
        signupDto.password = await bcrypt.hash(signupDto.password, salt);

        // const user = await this.userService.create(signupDto);
        // const { password, ...result } = user;
        // return result;

        try {
            const user = await this.userService.create(signupDto);
            return user;
        } catch (error) {
            // throw new UnauthorizedException(error);
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                throw new ConflictException("User with this email already exists");
            }
            throw error;
            // throw new ConflictException(error);
        }
        // const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

        // return {...user, access_token: token};

    }
}
