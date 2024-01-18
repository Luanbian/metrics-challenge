import { format, isValid } from "date-fns";

export const convertAndFormatDate = (value: number | null | undefined): string | null => {
  const excelBaseDate = new Date('1899-12-30').getTime();
  const secondsPerDay = 86400;
  const milisecondsPerSecond = 1000;
  const dateFormat = 'MM/dd/yy HH:mm';

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
      const originalDate = format(date, dateFormat);
      const originalHour = new Date(originalDate);
      originalHour.setHours(originalHour.getHours() + 3);
      const formatedDate = format(originalHour, dateFormat);
      return formatedDate;
    } catch (error) {
      console.error(`Erro ao converter data para o campo "${value}": `, error);
    }
  }
  return null;
};