import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class CartDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly userId: string;
}
