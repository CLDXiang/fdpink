import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_CONSTANT_SECRET } from '../utils/config';

export interface JwtPayload {
  sub: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT_SECRET,
    });
  }

  /**
   * decode payload, the payload is signed at auth.service login
   * @param payload decoded from token
   */
  // the following disable is due to this function can't be static.
  /* eslint-disable class-methods-use-this */
  async validate(payload: JwtPayload) {
    return {
      id: Number(payload.sub.substring(0, payload.sub.length - 1)),
      activated: Number(payload.sub[payload.sub.length - 1]),
      name: payload.name,
    };
  }
  /* eslint-enable */
}
