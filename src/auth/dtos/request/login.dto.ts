import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';
// login user body
@Exclude()
export class LoginDto extends BaseDto {
  @Expose()
  @IsEmail()
  @ApiProperty({ type: 'email' })
  readonly email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly password: string;
}
