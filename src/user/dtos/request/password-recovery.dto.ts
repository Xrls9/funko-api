import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';

// recovery password body
@Exclude()
export class PasswordRecoveryDto extends BaseDto {
  @Expose()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  readonly password: string;
}
