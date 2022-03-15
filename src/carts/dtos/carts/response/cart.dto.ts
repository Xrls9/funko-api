import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

// get users response
@Exclude()
export class CartDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly createdAt: string;
}
