import { Reactions } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

@Exclude()
export class FunkoReactionDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly funkoId: string;

  @Expose()
  @IsEnum(Reactions)
  readonly reaction: Reactions;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
