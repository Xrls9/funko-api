import { Field, ObjectType } from '@nestjs/graphql';
import { FunkoModel } from './funko.model';
import { PaginationInfoModel } from './pagination-info.model';

@ObjectType()
export class PaginationModel {
  @Field(() => [FunkoModel])
  readonly results: FunkoModel[];

  @Field()
  readonly paginationInfo: PaginationInfoModel;
}
