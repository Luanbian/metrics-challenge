import { format, isValid } from "date-fns";

export const convertAndFormatDate = (value: number | null | undefined, fieldName: string): string | null => {
  const excelBaseDate = new Date('1899-12-30').getTime();
  const secondsPerDay = 86400;
  const milisecondsPerSecond = 1000;
  const dateFormat = 'd/M/yy HH:mm';

  if (value !== null && value !== undefined) {
    try {
      const timestamp = value * secondsPerDay * milisecondsPerSecond + excelBaseDate;
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