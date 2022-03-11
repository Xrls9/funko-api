import { Injectable } from '@nestjs/common';
import { prisma } from 'src/prisma';

import { CreateUserDto } from '../dtos/request/create-user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const userFound = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
      rejectOnNotFound: false,
    });

    if (userFound) {
      throw new UnprocessableEntity('email already taken');
    }

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashSync(password, 10),
      },
    });

    const token = await AuthService.createToken(user.uuid);
    const accessToken = AuthService.generateAccessToken(token.jti);
    await SendgridService.sendEmail(user.email, accessToken);

    return true;
  }
}
