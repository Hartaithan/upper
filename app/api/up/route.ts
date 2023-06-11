import { getAuth } from "@/helpers/auth";
import { IError } from "@/models/ErrorModel";
import { ITokenData } from "@/models/TokenModel";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const UP_URL = process.env.NEXT_PUBLIC_UP_URL;
const AGENT = process.env.NEXT_PUBLIC_AGENT ?? "";
const HOST = process.env.NEXT_PUBLIC_HOST ?? "";

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
    await createNewTokens("access", "refresh");
    return NextResponse.json({ message: "Need refresh" }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Something went wrong!" },
    { status: 400 }
  );
};
