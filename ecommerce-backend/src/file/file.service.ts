import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: this.configService.get<string>('AWS_ENDPOINT'),
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{imageUrl: string}> {
    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await this.s3.upload(params as unknown as AWS.S3.Types.PutObjectRequest).promise();
      return {
        imageUrl: uploadResult.Location
      };
    } catch (error) {
      throw new Error(`Erro no upload do arquivo: ${error.message}`);
    }
  }
}