import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FunkoModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly name: string;

  @Field()
  readonly category: string;

  @Field({ nullable: true })
  readonly image: string;

  @Field()
  readonly price: number;

  @Field()
  readonly stock: number;

  @Field()
  readonly active: boolean;
}
