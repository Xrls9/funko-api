import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';

@Exclude()
export class CreateFunkoDto extends BaseDto {
  @Expose()
  @IsOptional()
  @IsString()
  readonly name: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly category: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly image: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly stock: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly active: boolean;
}
