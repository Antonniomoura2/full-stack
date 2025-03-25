import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  readonly file: Express.Multer.File;
}
