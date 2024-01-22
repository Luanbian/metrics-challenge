import { IExcelModel } from "src/data/mapper/excel.mapper";

export const jsonMock: IExcelModel[] = [
  {
    amountOfCharges: 10,
    billingEveryXDays: 30,
    startDate: '02/12/2001',
    status: 'Ativa',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_1',
    cancellationDate: '25/12/2023'
  },
  {
    amountOfCharges: 10,
    billingEveryXDays: 360,
    startDate: '02/12/2001',
    status: 'Cancelada',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_2',
    cancellationDate: '25/12/2023'
  },
  {
    amountOfCharges: 10,
    billingEveryXDays: 365,
    startDate: '02/12/2001',
    status: 'Trial cancelado',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_3',
    cancellationDate: '25/12/2023'
  },
  {
    amountOfCharges: 10,
    billingEveryXDays: 730,
    startDate: '02/12/2001',
    status: 'Atrasada',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_4',
    cancellationDate: '25/12/2023'
  },
  {
    amountOfCharges: 10,
    billingEveryXDays: 730,
    startDate: '02/12/2001',
    status: 'Upgrade',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_5',
    cancellationDate: '25/12/2023'
  },
  {
    amountOfCharges: 10,
    billingEveryXDays: 730,
    startDate: '02/12/2001',
    status: 'Upgrade',
    statusDate: '02/12/2001',
    value: 100,
    nextCycle: '02/12/2024',
    subscriberID: 'user_6',
    cancellationDate: null
  },
]