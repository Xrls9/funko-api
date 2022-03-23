import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class CartItemDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly cartId: string;

  @Expose()
  readonly funkoId: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly totalPrice: number;
}
