import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

// get users response
@Exclude()
export class CreateCartItemDto {
  @Expose()
  @IsString()
  readonly uuid: string;

  @Expose()
  @IsString()
  readonly cartID: string;

  @Expose()
  @IsString()
  readonly funkoID: string;

  @Expose()
  @IsNumber()
  readonly quantity: number;
}
