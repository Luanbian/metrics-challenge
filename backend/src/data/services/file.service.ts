import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class FileService {
  public async getFile(file: Express.Multer.File, extension: string): Promise<unknown[]> {
    let json: unknown[];
    if(extension === '.xlsx') {
      json = this.xlsxToJson(file.path);
    } else {
      json = await this.csvToJson(file.path);
    }
    return json;
  }

  private xlsxToJson(path: string): unknown[] {
    const workbook = xlsx.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return jsonData;
  }

  private async csvToJson(path: string): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      const result: unknown[] = [];
      fs.createReadStream(path)
        .pipe(csvParser())
        .on('data', data => result.push(data))
        .on('end', () => resolve(result))
        .on('error', error => reject(error));
    });
  }
}
