import { Injectable } from "@nestjs/common";
import { IExcelModel } from "../mapper/excel.mapper";

export interface Years {
  '2022': IExcelModel[]
  '2023': IExcelModel[]
  '2024': IExcelModel[]
}
@Injectable()
export class MetricsYearService {
  public async getFile(json: IExcelModel[]) {
    this.separatePerYear(json);
  }

  private separatePerYear(json: IExcelModel[]) {
    const separate: Years = {
      "2022": [],
      "2023": [],
      "2024": []
    }
    for(const item of json) {
      const { nextCycle } = item;
      console.log(nextCycle);
    }
  }
}