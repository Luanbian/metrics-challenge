import * as xlsx from 'xlsx';
import { format } from "date-fns";
import { IExcelModel, excelMapper } from '../data/mapper/excel.mapper';

export const xlsxToJson = (path: string): IExcelModel[] => {
  const workbook = xlsx.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  jsonData.forEach(item => {
    item["data início"] = convertAndFormatDate(item["data início"]);
    item["data status"] = convertAndFormatDate(item["data status"]);
    item["data cancelamento"] = convertAndFormatDate(item["data cancelamento"]);
    item["próximo ciclo"] = convertAndFormatDate(item["próximo ciclo"]);
  });
  return excelMapper(jsonData);
}

export const convertAndFormatDate = (value: number | null | undefined): string | null => {
  const excelBaseDate = new Date('1899-12-30').getTime();
  const secondsPerDay = 86400;
  const milisecondsPerSecond = 1000;
  const dateFormat = 'dd/MM/yy';

  if (value !== null && value !== undefined) {
    try {
      const timestamp = value * secondsPerDay * milisecondsPerSecond + excelBaseDate;
      const date = new Date(timestamp);
      date.setDate(date.getDate() + 1);
      const formatedDate = format(date, dateFormat);
      return formatedDate;
    } catch (error) {
      console.error(`Erro ao converter data para o campo "${value}": `, error);
    }
  }
  return null;
};