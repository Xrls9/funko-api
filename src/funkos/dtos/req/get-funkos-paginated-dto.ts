import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@Exclude()
export class GetFunkosPaginatedDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  readonly page?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  readonly pageItems?: number;

  @Expose()
  @IsOptional()
  readonly category?: string;
}
