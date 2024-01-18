import * as xlsx from 'xlsx';
import { convertAndFormatDate } from './convert.format.date';

export const xlsxToJson = (path: string): unknown[] => {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  jsonData.forEach(item => {
    item["data início"] = convertAndFormatDate(item["data início"]);
    item["data status"] = convertAndFormatDate(item["data status"]);
    item["data cancelamento"] = convertAndFormatDate(item["data cancelamento"]);
    item["próximo ciclo"] = convertAndFormatDate(item["próximo ciclo"]);
  });
  return jsonData;
}
