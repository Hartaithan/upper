import { ILoginResponse, ITokenData } from "@/models/TokenModel";
import { getAuth } from "./auth";
import { google } from "googleapis";
import { baseHeaders } from "./headers";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? "";
const CLIENT = process.env.NEXT_PUBLIC_CLIENT ?? "";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "";
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD ?? "";

export const getTokens = async (): Promise<ITokenData | null> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  let tokens: ITokenData | null = null;
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "tokens",
    });
    tokens = response.data as ITokenData;
  } catch (error) {
    console.error("get tokens error", error);
  }

  return tokens;
};

export const createNewTokens = async (access: string, refresh: string) => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  try {
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SHEET_ID,
      range: "tokens",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString(), access, refresh]],
      },
    });
  } catch (error) {
    console.error("create new tokens error", error);
  }
};

export const retrieveNewTokens = async () => {
  let response: ILoginResponse | null = null;
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

  const loginRequest = await fetch(LOGIN_URL, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!loginRequest.ok) return response;

  response = await loginRequest.json();
  return response;
};
