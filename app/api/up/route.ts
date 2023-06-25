import { saveNewTokens, getTokens, retrieveNewTokens } from "@/helpers/token";
import { upRequest } from "@/helpers/up";
import { NextResponse } from "next/server";

export const GET = async () => {
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

  const upStatus = await upRequest(access);

  if (upStatus === "env_not_found") {
    return NextResponse.json(
      { message: "Unable to get env variables" },
      { status: 400 }
    );
  }

  if (upStatus === "completed") {
    return NextResponse.json({ message: "Up completed!" }, { status: 200 });
  }

  if (upStatus === "limit_exceeded") {
    return NextResponse.json({ message: "Limit exceeded" }, { status: 400 });
  }

  if (upStatus === "unknown") {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  }

  const newTokens = await retrieveNewTokens();
  if (!newTokens) {
    return NextResponse.json(
      { message: "Unable to get new session" },
      { status: 400 }
    );
  }
  saveNewTokens(newTokens.access_token, newTokens.refresh_token);
  const upStatusRetry = await upRequest(newTokens.access_token);

  if (upStatusRetry === "completed") {
    return NextResponse.json(
      { message: "Up completed after refresh!" },
      { status: 200 }
    );
  }

  if (upStatusRetry === "limit_exceeded") {
    return NextResponse.json(
      { message: "Limit exceeded after refresh" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Something went wrong!", status: upStatusRetry },
    { status: 400 }
  );
};
