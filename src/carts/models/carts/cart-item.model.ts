import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartItemModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly cartId: string;

  @Field()
  readonly funkoId: string;

  @Field()
  readonly description: string;

  @Field()
  readonly quantity: number;

  @Field()
  readonly unitPrice: number;

  @Field()
  readonly totalPrice: number;
}
