import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';

@Exclude()
export class CreateFunkoDto extends BaseDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly category: string;

  @Expose()
  @IsOptional()
  readonly image: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly stock: number;

  @Expose()
  @IsOptional()
  readonly active: boolean;
}
