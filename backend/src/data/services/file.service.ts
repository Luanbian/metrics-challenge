import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  getFile(file: Express.Multer.File): void {
    console.log(file);
  }
}
