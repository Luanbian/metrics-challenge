import { Injectable } from '@nestjs/common';
import { csvToJson } from 'src/utils/csv.to.json';
import { xlsxToJson } from 'src/utils/xlsx.to.json';

@Injectable()
export class FileService {
  public async getFile(file: Express.Multer.File, extension: string): Promise<unknown[]> {
    let json: unknown[];
    if(extension === '.xlsx') {
      json = xlsxToJson(file.path);
    } else {
      json = await csvToJson(file.path);
    }
    return json;
  }
}
