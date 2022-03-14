import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseDto } from 'src/dtos/base.dto';

// recovery password body
@Exclude()
export class PasswordRecoveryDto extends BaseDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Expose()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  readonly password: string;

  @Expose()
  @IsString()
  @Length(5, 20)
  @IsNotEmpty()
  readonly passwordRepeated: string;
}
