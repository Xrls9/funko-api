import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class Order {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly createdAt: string;
}
