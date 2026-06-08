import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
    });
  }

  async validate(payload: any) {
    // Here we can add extra validation logic if needed
    // Or we can add all the logic for validating and returning the user, e.g:
    // const user = await this.userService.findByEmail(payload.email);
    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }
    // Check that we always use the service (userService) for validation logic
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
