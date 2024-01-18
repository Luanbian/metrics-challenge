import * as csvParser from 'csv-parser';
import * as fs from 'fs';

export const csvToJson = async (path: string): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const result: unknown[] = [];
    fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', data => result.push(data))
      .on('end', () => resolve(result))
      .on('error', error => reject(error));
  });
}