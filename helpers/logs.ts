import { google } from "googleapis";
import { getAuth } from "./auth";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

export const createLog = async () => {
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
