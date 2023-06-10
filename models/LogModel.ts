import { IData } from "./DataModel";
import { IResponse } from "./ResponseModel";

export type ILog = [string];

export interface ILogsData extends IData {
  values: ILog[];
}

export interface ILogsResponse extends IResponse {
  data: ILogsData | null;
}
