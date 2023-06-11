import { IData } from "./DataModel";
import { IResponse } from "./ResponseModel";

export type IToken = [string, string, string];

export interface ITokenData extends IData {
  values: IToken[];
}

export interface ITokenResponse extends IResponse {
  data: ITokenData | null;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}
