import { Expose } from 'class-transformer';
import { FunkoDto } from './funko.dto';

export class PaginationDto {
  @Expose()
  readonly results: FunkoDto[];

  @Expose()
  readonly paginationInfo: object;
}
