import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('app.jwt.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    // Return user object with roles to be accessible in the request
    return {
      id: user._id?.toString() || '',
      username: user.username,
      email: user.email,
      roles: user.roles,
    };
  }
} 