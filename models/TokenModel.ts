import { IData } from "./DataModel";
import { IResponse } from "./ResponseModel";

export type IToken = [string, string, string];

export interface ITokenData extends IData {
  values: IToken[];
}

export interface ITokenResponse extends IResponse {
  data: ITokenData | null;
}
