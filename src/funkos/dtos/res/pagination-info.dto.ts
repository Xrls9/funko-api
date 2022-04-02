import { Expose } from 'class-transformer';

export class PaginationInfoDto {
  @Expose()
  readonly skip: number;

  @Expose()
  readonly take: number;
}
