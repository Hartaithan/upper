import { getAuth } from "@/helpers/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;

export const GET = async (): Promise<NextResponse> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[GET_SHEET]: request");
  try {
    const { data } = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
      auth,
    });
    console.info("[GET_SHEET]: complete");
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET_SHEET]: error", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  }
};
