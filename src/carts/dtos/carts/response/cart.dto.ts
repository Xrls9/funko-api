import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class CartDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userID: string;

  @Expose()
  readonly totalPrice: number;
}
