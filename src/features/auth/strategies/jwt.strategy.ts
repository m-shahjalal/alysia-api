import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../../features/user/user.service';
import { UserAccessTokenClaims } from '../../../global/request/auth-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(
    payload: UserAccessTokenClaims,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.userService.findById(payload.id);

    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email };
  }
}
