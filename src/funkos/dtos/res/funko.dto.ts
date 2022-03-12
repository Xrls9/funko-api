import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FunkoDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly category: string;

  @Expose()
  readonly image: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly stock: number;
}
