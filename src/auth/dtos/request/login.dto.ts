import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/dtos/base.dto';

// login user body
@Exclude()
export class LoginDto extends BaseDto {
  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
