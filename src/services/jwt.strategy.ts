import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { prisma } from 'src/prisma';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const configService = new ConfigService();
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
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
