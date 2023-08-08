import { Data } from "./DataModel";
import { Response } from "./ResponseModel";

export type Log = [string];

export interface LogsData extends Data {
  values: Log[];
}

export interface LogsResponse extends Response {
  data: LogsData | null;
}
