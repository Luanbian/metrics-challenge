import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { format, isValid } from 'date-fns';

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
    const formatedJson = this.convertDateToString(jsonData);
    return formatedJson;
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

  private convertDateToString(json: unknown[]): unknown[] {
    json.forEach(item => {
      item["data início"] = this.convertAndFormatDate(item["data início"], "data início");
      item["data status"] = this.convertAndFormatDate(item["data status"], "data status");
      item["data cancelamento"] = this.convertAndFormatDate(item["data cancelamento"], "data cancelamento");
    });
    return json;
  }

  private convertAndFormatDate = (value: number | null | undefined, fieldName: string): string | null => {
    const secondsPerDay = 86400;
    const milisecondsPerSecond = 1000;
    const dateFormat = 'd/M/yy HH:mm';
  
    if (value !== null && value !== undefined) {
      try {
        const timestamp = value * secondsPerDay * milisecondsPerSecond;
        if (timestamp > Number.MAX_SAFE_INTEGER || timestamp < Number.MIN_SAFE_INTEGER) {
          return null;
        }
        const date = new Date(timestamp);
        if (!isValid(date)) {
          return null;
        }
        return format(date, dateFormat);
      } catch (error) {
        console.error(`Erro ao converter data para o campo "${fieldName}": `, error);
      }
    }
    return null;
  };
}
