import UpButton from "@/components/UpButton";
import { getAuth } from "@/helpers/auth";
import { ILogsData, ILogsResponse } from "@/models/LogModel";
import { google } from "googleapis";
import { NextPage } from "next";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEETS_ID;

export const dynamic = "force-dynamic";

const getLogs = async (): Promise<ILogsResponse> => {
  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  let data: ILogsData | null = null;
  try {
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "logs",
    });
    data = response.data as ILogsData;
  } catch (error) {
    console.error("get logs error", error);
    return { status: "error", data: null };
  }

  return { status: "success", data };
};

const Home: NextPage = async () => {
  const response = await getLogs();

  const lastRow = response.data?.values.at(-1) ?? null;
  const lastItem = lastRow ? lastRow[0] : null;

  return (
    <main className="flex flex-col items-center justify-center p-5">
      <div className="bg-neutral-950 p-2 rounded-md mb-5">
        {response.status === "success" && (
          <>
            <h1 className="text-sm font-bold">Last up:</h1>
            <p className="text-sm">
              {lastItem ? new Date(lastItem).toString() : "[Not Found]"}
            </p>
          </>
        )}
        {response.status === "error" && <p>something went wrong ¯\_(ツ)_/¯</p>}
      </div>
      <UpButton />
    </main>
  );
};

export default Home;
