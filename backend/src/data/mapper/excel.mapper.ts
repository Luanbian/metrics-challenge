export interface IExcelModel {
  amountOfCharges: number | string
  billingEveryXDays: number | string
  startDate: string
  status: string
  statusDate: string
  value: string | number
  nextCycle: string
  subscriberID: string
  cancellationDate: string
}

export const excelMapper = (data: unknown[]): IExcelModel[] => {
  if(!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid input data');
  }

  const mappedData: IExcelModel[] = data.map(item => ({
    amountOfCharges: item['quantidade cobranças'],
    billingEveryXDays: item['cobrada a cada X dias'],
    startDate: item['data início'],
    status: item['status'],
    statusDate: item['data status'],
    value: item['valor'],
    nextCycle: item['próximo ciclo'],
    subscriberID: item['ID assinante'],
    cancellationDate: item['data cancelamento'],
  }));

  return mappedData;
}