import { Sheets } from "@/models/SheetModel";
import { sheets_v4 } from "googleapis";

export const updatePayload = (
  sheetId: Sheets,
  payload: string[],
  delimiter = ","
): sheets_v4.Schema$Request[] => {
  const data = payload.join(delimiter);
  return [
    {
      insertRange: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        shiftDimension: "ROWS",
      },
    },
    {
      pasteData: {
        data,
        type: "PASTE_NORMAL",
        delimiter,
        coordinate: {
          sheetId,
          rowIndex: 0,
        },
      },
    },
  ];
};
