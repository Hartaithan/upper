import { Data } from "./DataModel";
import { Response } from "./ResponseModel";

export type Token = [string, string, string];

export interface TokenData extends Data {
  values: Token[];
}

export interface TokenResponse extends Response {
  data: TokenData | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

export type TokenStatus = "tokens_not_found" | "active_tokens_not_found";

export interface ActiveTokens {
  created_at: string;
  access_token: string;
  refresh_token: string;
}

export type ActiveTokensResponse = ActiveTokens | null;
