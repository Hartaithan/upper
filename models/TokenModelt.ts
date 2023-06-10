import { IData } from "./DataModel";

export type IToken = [string, string, string];

export interface ITokenData extends IData {
  values: IToken[];
}

export interface ITokenResponse {
  message: string;
  data: ITokenData | null;
}
