import { Expose, Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';

// create user body
@Exclude()
export class CreateUserDto extends BaseDto {
  @Expose()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly username: string;

  @Expose()
  @IsString()
  @Length(5, 20)
  @IsOptional()
  readonly password: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly role: string;

  @Expose()
  @IsOptional()
  readonly verified: boolean;
}
