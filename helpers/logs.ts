import { google } from "googleapis";
import { getAuth } from "./auth";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;

export const createLog = async () => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[CREATE_LOG]: request");
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
    console.info("[CREATE_LOG]: complete");
  } catch (error) {
    console.error("[CREATE_LOG]: error", error);
  }
};
