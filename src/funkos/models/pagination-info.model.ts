import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfoModel {
  @Field()
  readonly skip: number;

  @Field()
  readonly take: number;
}
