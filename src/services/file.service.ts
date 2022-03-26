import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  async uploadPublicFile(fileName: string, extension: string): Promise<string> {
    const s3 = new S3();

    return await s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${fileName}.${extension}`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
      ContentType: 'image/png',
    });
  }

  async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return await s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${key}`,
      Expires: parseInt(this.configService.get('AWS_EXPIRE_TIME'), 10),
    });
  }
}
