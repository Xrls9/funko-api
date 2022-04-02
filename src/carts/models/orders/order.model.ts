import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly userId: string;

  @Field()
  readonly totalPrice: number;

  @Field()
  readonly createdAt: string;
}
