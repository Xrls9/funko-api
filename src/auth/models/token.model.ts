import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenModel {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly exp: number;
}
