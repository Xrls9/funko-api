import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly totalPrice: number;

  @Field()
  readonly createdAt: string;
}
