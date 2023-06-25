import { google } from "googleapis";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_SHEETS_PRIVATE_KEY ?? "";

const credentials = {
  client_email: process.env.NEXT_PUBLIC_SHEETS_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_SHEETS_CLIENT_ID,
  private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
};

export const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
};
