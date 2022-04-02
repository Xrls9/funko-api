import { Expose } from 'class-transformer';
import { FunkoDto } from './funko.dto';
import { PaginationInfoDto } from './pagination-info.dto';

export class PaginationDto {
  @Expose()
  readonly results: FunkoDto[];

  @Expose()
  readonly paginationInfo: PaginationInfoDto;
}
