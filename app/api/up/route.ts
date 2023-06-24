import { baseHeaders } from "@/helpers/headers";
import { createLog } from "@/helpers/logs";
import { createNewTokens, getTokens, retrieveNewTokens } from "@/helpers/token";
import { IError } from "@/models/ErrorModel";
import { NextResponse } from "next/server";

const UP_URL = process.env.NEXT_PUBLIC_UP_URL;

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

  const [_created_at, access, _refresh] = lastTokenPair;

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
    const newTokens = await retrieveNewTokens();
    if (!newTokens) {
      return NextResponse.json(
        { message: "Unable to get new session" },
        { status: 400 }
      );
    }
    await createNewTokens(newTokens.access_token, newTokens.refresh_token);

    const headers = {
      ...baseHeaders,
      Authorization: `Bearer ${newTokens.access_token}`,
    };
    const upRequest = await fetch(UP_URL, { method: "POST", headers });

    if (upRequest.ok) {
      await createLog();
      return NextResponse.json({ message: "Up completed!" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Unable to refresh tokens" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Something went wrong!" },
    { status: 400 }
  );
};
