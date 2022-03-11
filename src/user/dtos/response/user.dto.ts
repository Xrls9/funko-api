import { Exclude, Expose } from 'class-transformer';

// get users response
@Exclude()
export class UserDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly role: string;

  @Expose()
  readonly verified: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
