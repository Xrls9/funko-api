import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { BaseDto } from '../../../dtos/base.dto';
import { UserRole } from '../../../utils/enums';

@InputType()
export class CreateUserInput extends BaseDto {
  @Field()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @Field()
  @IsString()
  @IsOptional()
  readonly username: string;

  @Field()
  @IsString()
  @Length(5, 20)
  @IsOptional()
  readonly password: string;

  @Field()
  @IsString()
  @IsOptional()
  readonly firstName: string;

  @Field()
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @Field()
  @IsString()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @Field()
  @IsOptional()
  readonly verified: boolean;
}
