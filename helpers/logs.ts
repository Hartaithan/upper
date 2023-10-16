import { google } from "googleapis";
import { getAuth } from "./auth";
import { Sheets } from "@/models/SheetModel";
import { LastLogResponse, LogsData, LogsResponse } from "@/models/LogModel";
import { updatePayload } from "./update";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;

export const createLog = async () => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[CREATE_LOG]: request");
  try {
    const payload = updatePayload(Sheets.Logs, [
      new Date().toISOString(),
      "a",
      "b",
    ]);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: payload,
      },
      auth,
    });
    console.info("[CREATE_LOG]: complete");
  } catch (error) {
    console.error("[CREATE_LOG]: error", error);
  }
};

export const getLogs = async (): Promise<LogsResponse> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[GET_LOGS]: request");
  let data: LogsData | null = null;
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "logs",
    });
    data = response.data as LogsData;
  } catch (error) {
    console.error("[GET_LOGS]: error", error);
    return { status: "error", data: null };
  }

  console.info("[GET_LOGS]: complete");
  return { status: "success", data };
};

export const getLastLog = async (): Promise<LastLogResponse> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  console.info("[GET_LAST_LOG]: request");
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "logs!A1:C1",
    });
    const logs = response.data as LogsData;
    if (!logs.values || logs.values.length === 0) {
      console.info("[GET_LAST_LOG]: values not found");
      return null;
    }
    const [created_at] = logs.values[0];
    console.info("[GET_LAST_LOG]: complete");
    return { created_at };
  } catch (error) {
    console.error("[GET_LAST_LOG]: error", error);
    return null;
  }
};
