import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";
import { Years } from "../interfaces/year.service.protocol";

@Injectable()
export class MetricsYearService {
  public async metrics(json: IExcelModel[], type: string): Promise<Years> {
    const separatePerYear = this.separatePerYear(json, type);
    return separatePerYear;
  }

  private separatePerYear(json: IExcelModel[], type: string): Years {
    const separate: Years = {
      "2022": [],
      "2023": [],
      "2024": [],
      "2025": []
    }
    for(const item of json) {
      let year: string;
      if (type === 'mrr') {
        const { nextCycle } = item;
        year = nextCycle[nextCycle.length - 1];
      } else {
        const { cancellationDate } = item;
        if (cancellationDate !== null) {
          year = cancellationDate[cancellationDate.length - 1];
        } else {
          year = null;
        }
      }
      if (year !== null) {
        separate[`202${year}`].push(item);
      }
    }
    return separate;
  }
}