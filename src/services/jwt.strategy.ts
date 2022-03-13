import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { prisma } from 'src/prisma';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const token = await prisma.token.findUnique({
      where: {
        jti: payload.sub,
      },
      select: {
        user: { select: { uuid: true } },
      },
      rejectOnNotFound: false,
    });

    const { user } = token;
    return user;
  }
}