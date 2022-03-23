import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class FileUpload {
  @Expose()
  @IsString()
  readonly id: string;

  @Expose()
  @IsString()
  readonly url: number;

  @Expose()
  @IsString()
  readonly key: string;
}
