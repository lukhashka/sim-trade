import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_123', // Має співпадати з тим, що в AuthModule!
    });
  }

  async validate(payload: any) {
    // Цей об'єкт потрапляє в req.user
    return { userId: payload.sub, email: payload.email };
  }
}
