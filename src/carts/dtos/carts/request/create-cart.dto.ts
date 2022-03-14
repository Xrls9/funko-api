import { Expose, Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../../../dtos/base.dto';

// create user body
@Exclude()
export class CreateCartDto extends BaseDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  readonly totalPrice: number;
}
