import { Field, ObjectType } from '@nestjs/graphql';
import { OrderItemModel } from './order-item.model';
import { OrderModel } from './order.model';

@ObjectType()
export class OrderResponseModel {
  @Field()
  readonly orderInfo: OrderModel;

  @Field()
  readonly count: number;

  @Field(() => [OrderItemModel])
  readonly orderDetails: OrderItemModel[];
}
