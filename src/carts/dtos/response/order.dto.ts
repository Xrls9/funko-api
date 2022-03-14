import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class Order {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userID: string;

  @Expose()
  readonly total: number;
}
