import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseDto } from '../../../../dtos/base.dto';

@InputType()
export class CreateCartInput extends BaseDto {
  @Field()
  @IsNumber()
  @IsOptional()
  readonly totalPrice: number;
}
