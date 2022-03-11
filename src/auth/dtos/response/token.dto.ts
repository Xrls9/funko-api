import { Exclude, Expose } from 'class-transformer';
// create token response
@Exclude()
export class TokenDto {
  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly exp: number;
}
