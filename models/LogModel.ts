import { IData } from "./DataModel";

export type ILog = [string];

export interface ILogsData extends IData {
  values: ILog[];
}

export interface ILogsResponse {
  message: string;
  data: ILogsData | null;
}
