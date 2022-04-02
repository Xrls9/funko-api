import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Reactions } from '../../utils/enums';

@ObjectType()
export class FunkoReactionModel {
  @Field()
  readonly uuid: string;

  @Field()
  readonly userId: string;

  @Field()
  readonly funkoId: string;

  @Field()
  readonly reaction: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}
