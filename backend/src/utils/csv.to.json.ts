import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { IExcelModel, excelMapper } from 'src/data/mapper/excel.mapper';

export const csvToJson = async (path: string): Promise<IExcelModel[]> => {
  return new Promise((resolve, reject) => {
    const result: IExcelModel[] = [];
    fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', data => result.push(data))
      .on('end', () => resolve(excelMapper(result)))
      .on('error', error => reject(error));
  });
}