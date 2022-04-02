import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly username: string;

  @Field()
  readonly email: string;

  @Field()
  readonly firstName: string;

  @Field()
  readonly lastName: string;

  @Field()
  readonly role: string;

  @Field()
  readonly verified: boolean;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}
