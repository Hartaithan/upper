import { getAuth } from "@/helpers/auth";
import { ILogsData, ILogsResponse } from "@/models/LogModel";
import { google } from "googleapis";
import { NextPage } from "next";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;

const getData = async (): Promise<ILogsResponse> => {
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
    console.log("data", data);
  } catch (error) {
    console.log("error", error);
    return { message: "error", data: null };
  }

  return { message: "logs fetched", data };
};

const Home: NextPage = async () => {
  const response = await getData();
  return (
    <main className="flex flex-col items-center justify-center">
      <h2 className="mb-3 text-2xl font-semibold">Hello World!</h2>
      <pre className="text-[9px] whitespace-pre-wrap break-words">
        {JSON.stringify(response, null, 2)}
      </pre>
    </main>
  );
};

export default Home;
