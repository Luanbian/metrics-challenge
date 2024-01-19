import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";
import { format, parse } from "date-fns";
import { ptBR } from 'date-fns/locale';

export interface Months {
  jan: IExcelModel[]
  fev: IExcelModel[]
  mar: IExcelModel[]
  abr: IExcelModel[]
  mai: IExcelModel[]
  jun: IExcelModel[]
  jul: IExcelModel[]
  ago: IExcelModel[]
  set: IExcelModel[]
  out: IExcelModel[]
  nov: IExcelModel[]
  dez: IExcelModel[]
}

@Injectable()
export class MetricsMonthService {
  public async metrics(year:IExcelModel[]): Promise<Months> {
    const separatePerMonth = this.separatePerMonth(year);
    return separatePerMonth;
  }

  private separatePerMonth(year: IExcelModel[]) {
    const separate: Months = {
      jan: [],
      fev: [],
      mar: [],
      abr: [],
      mai: [],
      jun: [],
      jul: [],
      ago: [],
      set: [],
      out: [],
      nov: [],
      dez: [],
    }

    for (const item of year) {
      const { nextCycle } = item;
      const date = parse(nextCycle, 'dd/MM/yyyy', new Date());
      const formated = format(date, 'dd/LLL/yyyy', {locale: ptBR});
      const monthKey = formated.split('/')[1].toLowerCase();
      separate[monthKey].push(item);
    }
    return separate;
  }
}