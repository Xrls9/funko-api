import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../../dtos/base.dto';

@InputType()
export class CreateOrderInput extends BaseDto {
  @Field()
  @IsString()
  readonly userId: string;

  @Field()
  @IsNumber()
  @IsOptional()
  readonly totalPrice: string;
}
