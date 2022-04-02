import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';
import { Reactions } from '../../../utils/enums';

@InputType()
export class CreateFunkoReactionInput extends BaseDto {
  @Field()
  @IsOptional()
  @IsString()
  readonly userId: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly funkoId: string;

  @Field()
  @IsOptional()
  @IsEnum(Reactions)
  readonly reaction: Reactions;
}
