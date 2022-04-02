import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';

@InputType()
export class CreateFunkoInput extends BaseDto {
  @Field()
  @IsString()
  readonly name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly category: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly image?: string;

  @Field(() => Float)
  @IsNumber()
  readonly price: number;

  @Field(() => Int)
  @IsNumber()
  readonly stock: number;

  @Field()
  readonly active: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly description: string;
}
