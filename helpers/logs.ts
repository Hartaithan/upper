import { google } from "googleapis";
import { getAuth } from "./auth";
import { Sheets } from "@/models/SheetModel";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;

export const createLog = async () => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[CREATE_LOG]: request");
  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [
          {
            insertRange: {
              range: {
                sheetId: Sheets.Logs,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              shiftDimension: "ROWS",
            },
          },
          {
            pasteData: {
              data: new Date().toISOString(),
              type: "PASTE_NORMAL",
              delimiter: ",",
              coordinate: {
                sheetId: Sheets.Logs,
                rowIndex: 0,
              },
            },
          },
        ],
      },
      auth,
    });
    console.info("[CREATE_LOG]: complete");
  } catch (error) {
    console.error("[CREATE_LOG]: error", error);
  }
};
