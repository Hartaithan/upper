import {
  ActiveTokensResponse,
  LoginResponse,
  TokenData,
} from "@/models/TokenModel";
import { getAuth } from "./auth";
import { google } from "googleapis";
import { baseHeaders } from "./headers";
import { Sheets } from "@/models/SheetModel";
import { updatePayload } from "./update";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;
const LOGIN_URL = process.env.NEXT_PUBLIC_SERVICE_LOGIN_URL;
const APP_ID = process.env.NEXT_PUBLIC_SERVICE_APP_ID ?? "";
const CLIENT = process.env.NEXT_PUBLIC_SERVICE_CLIENT ?? "";
const EMAIL = process.env.NEXT_PUBLIC_SERVICE_EMAIL ?? "";
const PASSWORD = process.env.NEXT_PUBLIC_SERVICE_PASSWORD ?? "";

export const getTokens = async (): Promise<TokenData | null> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  let tokens: TokenData | null = null;
  console.info("[GET_TOKENS]: request");
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "tokens",
    });
    tokens = response.data as TokenData;
    console.info("[GET_TOKENS]: complete");
  } catch (error) {
    console.error("[GET_TOKENS]: error", error);
  }

  return tokens;
};

export const getActiveTokens = async (): Promise<ActiveTokensResponse> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[GET_ACTIVE_TOKENS]: request");
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "tokens!A1:C1",
    });
    const tokens = response.data as TokenData;
    if (!tokens.values || tokens.values.length === 0) {
      console.info("[GET_ACTIVE_TOKENS]: values not found");
      return null;
    }
    const [created_at, access_token, refresh_token] = tokens.values[0];
    console.info("[GET_ACTIVE_TOKENS]: complete");
    return { created_at, access_token, refresh_token };
  } catch (error) {
    console.error("[GET_ACTIVE_TOKENS]: error", error);
    return null;
  }
};

export const saveNewTokens = async (access: string, refresh: string) => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[SAVE_TOKENS]: request");
  try {
    const payload = updatePayload(Sheets.Tokens, [
      new Date().toISOString(),
      access,
      refresh,
    ]);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: payload,
      },
      auth,
    });
    console.info("[SAVE_TOKENS]: complete");
  } catch (error) {
    console.error("[SAVE_TOKENS]: error", error);
  }
};

export const retrieveNewTokens = async () => {
  let response: LoginResponse | null = null;
  if (LOGIN_URL === undefined) {
    return response;
  }
  const headers = { ...baseHeaders, Authorization: `Bearer ${CLIENT}` };

  const formData = new FormData();
  formData.append("app_id", APP_ID);
  formData.append("app_version", "7.25");
  formData.append("app_type", "applicant");
  formData.append("platform", "android");
  formData.append("platform_version", "8.0.0");
  formData.append("grant_type", "password");
  formData.append("login", EMAIL);
  formData.append("password", PASSWORD);

  console.info("[NEW_TOKENS]: request");
  const loginRequest = await fetch(LOGIN_URL, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-cache",
  });
  if (!loginRequest.ok) {
    console.info("[NEW_TOKENS]: error");
    return response;
  }

  response = await loginRequest.json();
  console.info("[NEW_TOKENS]: complete");
  return response;
};
