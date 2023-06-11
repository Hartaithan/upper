import { getAuth } from "@/helpers/auth";
import { IError } from "@/models/ErrorModel";
import { ILoginResponse, ITokenData } from "@/models/TokenModel";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const UP_URL = process.env.NEXT_PUBLIC_UP_URL;
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const AGENT = process.env.NEXT_PUBLIC_AGENT ?? "";
const HOST = process.env.NEXT_PUBLIC_HOST ?? "";
const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? "";
const CLIENT = process.env.NEXT_PUBLIC_CLIENT ?? "";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "";
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD ?? "";

export const baseHeaders = new Headers({
  "User-Agent": AGENT,
  host: HOST,
});

const getTokens = async (): Promise<ITokenData | null> => {
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
    console.error("error", error);
  }

  return tokens;
};

const createLog = async () => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  try {
    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SHEET_ID,
      range: "logs",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString()]],
      },
    });
  } catch (error) {
    console.error("error", error);
  }
};

const createNewTokens = async (access: string, refresh: string) => {
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
    console.error("error", error);
  }
};

const retrieveNewTokens = async () => {
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

export const GET = async () => {
  if (UP_URL === undefined) {
    return NextResponse.json(
      { message: "Unable to get env variables" },
      { status: 400 }
    );
  }

  let tokens = await getTokens();
  if (tokens === null) {
    return NextResponse.json(
      { message: "Unable to get tokens" },
      { status: 400 }
    );
  }

  const lastTokenPair = tokens.values.at(-1);
  if (!lastTokenPair) {
    return NextResponse.json(
      { message: "Unable to get active pair of tokens" },
      { status: 400 }
    );
  }

  const [created_at, access, refresh] = lastTokenPair;
  console.info("token:", new Date(created_at).toString(), access, refresh);

  const headers = { ...baseHeaders, Authorization: `Bearer ${access}` };
  const upRequest = await fetch(UP_URL, { method: "POST", headers });

  if (upRequest.ok) {
    await createLog();
    return NextResponse.json({ message: "Up completed!" }, { status: 200 });
  }

  const upResponse = await upRequest.json();
  const errors: IError[] = upResponse.errors || [];
  if (errors.some((err) => err.value === "touch_limit_exceeded")) {
    return NextResponse.json({ message: "Limit exceeded" }, { status: 400 });
  }
  if (errors.some((err) => err.value === "bad_authorization")) {
    const newTokens = await retrieveNewTokens();
    if (!newTokens) {
      return NextResponse.json(
        { message: "Unable to get new session" },
        { status: 400 }
      );
    }
    await createNewTokens(newTokens.access_token, newTokens.refresh_token);

    const headers = {
      ...baseHeaders,
      Authorization: `Bearer ${newTokens.access_token}`,
    };
    const upRequest = await fetch(UP_URL, { method: "POST", headers });

    if (upRequest.ok) {
      await createLog();
      return NextResponse.json({ message: "Up completed!" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Unable to refresh tokens" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Something went wrong!" },
    { status: 400 }
  );
};
