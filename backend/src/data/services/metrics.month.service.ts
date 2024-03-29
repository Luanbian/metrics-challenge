import { Injectable } from "@nestjs/common";
import { format, parse } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Months } from "../interfaces/month.service.protocol";
import { Years } from "../interfaces/year.service.protocol";
import { IExcelModel } from "../mapper/excel.mapper";

@Injectable()
export class MetricsMonthService {
  public async metrics(years:Years) {
    const separatePerMonth: Months = {
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
    };
    
    for (const [year, data] of Object.entries(years)) {
      separatePerMonth[year] = this.separatePerMonth(data);
    }

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
      const { cancellationDate } = item;
      const date = parse(cancellationDate, 'dd/MM/yyyy', new Date());
      const formated = format(date, 'dd/LLL/yyyy', {locale: ptBR});
      const monthKey = formated.split('/')[1].toLowerCase();
      separate[monthKey].push(item);
    }
    return separate;
  }
}