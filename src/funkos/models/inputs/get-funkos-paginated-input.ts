import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GetFunkosPaginatedInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  readonly page: number = 1;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  readonly pageItems: number = 10;

  @Field({ nullable: true })
  @IsOptional()
  readonly category: string;
}
