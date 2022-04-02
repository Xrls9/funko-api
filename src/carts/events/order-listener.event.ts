import { Injectable } from '@nestjs/common';
import { FunkoService } from '../../funkos/services/funko.service';
import { SendgridService } from '../../services/sengrid.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Funko } from '@prisma/client';
import { prisma } from '../../prisma';

@Injectable()
export class OrderUpdatedListener {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly funkoService: FunkoService,
  ) {}

  @OnEvent('order.updated')
  async handleOrderUpdatedEvent(funko: Funko) {
    try {
      let filteredUsers: string[];

      const userReactedToFunko = await prisma.funkoReaction.findMany({
        where: { funkoId: funko.uuid },
        select: { userId: true },
        orderBy: { createdAt: 'desc' },
      });

      filteredUsers = userReactedToFunko.map((item) => item.userId);

      console.log('filteredUsers that reacted to funko :>> ', filteredUsers);

      const userBoughtFunko = await prisma.orderItem.findMany({
        where: {
          funkoId: funko.uuid,
          order: {
            userId: {
              in: filteredUsers,
            },
          },
        },
        include: {
          order: {
            select: {
              userId: true,
            },
          },
        },
      });

      filteredUsers = filteredUsers.filter((item) => {
        return !userBoughtFunko.some((order) => order.order.userId === item);
      });

      console.log(
        'filteredUsers that reacted to funko and did not buy it:>> ',
        filteredUsers,
      );

      const usersToSendEmail = await prisma.user.findMany({
        where: { uuid: { in: filteredUsers } },
      });
      console.log('usersToSendEmail :>> ', usersToSendEmail);
      const funkoImage = await this.funkoService.getFile(funko.image);

      for (const user of usersToSendEmail) {
        await this.sendgridService.sendEmail(
          user.email,
          `<h1>This Products are running out of stock, make shure you buy them before you miss them</h1>
          <img src="${funkoImage}">`,
          'Some products you liked are running out of stock',
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
