import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';
// login user body
@Exclude()
export class LoginDto extends BaseDto {
  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
