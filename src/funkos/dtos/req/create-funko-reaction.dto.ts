import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';
import { Reactions } from '@prisma/client';

@Exclude()
export class CreateFunkoReactionDto extends BaseDto {
  @Expose()
  @IsOptional()
  @IsString()
  readonly userId: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly funkoId: string;

  @Expose()
  @IsOptional()
  @IsEnum(Reactions)
  readonly reaction: Reactions;
}
