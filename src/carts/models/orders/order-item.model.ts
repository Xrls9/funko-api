import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { CartItemModel } from '../carts/cart-item.model';

@ObjectType()
export class OrderItemModel extends OmitType(CartItemModel, [
  'cartId',
] as const) {
  @Field()
  readonly orderId: string;
}
