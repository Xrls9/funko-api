import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @Field()
  @IsString()
  readonly funkoId: string;

  @Field()
  @IsNumber()
  readonly quantity: number;
}
