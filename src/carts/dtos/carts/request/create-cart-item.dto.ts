import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

// get users response
@Exclude()
export class CreateCartItemDto {
  @Expose()
  @IsString()
  readonly funkoId: string;

  @Expose()
  @IsNumber()
  readonly quantity: number;
}
