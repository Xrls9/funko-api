import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class CartItemDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userID: string;

  @Expose()
  readonly cartID: string;

  @Expose()
  readonly funkoID: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly totalPrice: number;
}
