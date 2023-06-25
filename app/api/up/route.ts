import { saveNewTokens, getTokens, retrieveNewTokens } from "@/helpers/token";
import { upRequest } from "@/helpers/up";
import { UpResponse } from "@/models/UpModel";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async (): Promise<NextResponse<UpResponse>> => {
  let tokens = await getTokens();
  if (tokens === null) {
    return NextResponse.json(
      { message: "Unable to get tokens", status: "tokens_not_found" },
      { status: 400 }
    );
  }

  const lastTokenPair = tokens.values.at(-1);
  if (!lastTokenPair) {
    return NextResponse.json(
      {
        message: "Unable to get active pair of tokens",
        status: "active_tokens_not_found",
      },
      { status: 400 }
    );
  }

  const [_created_at, access, _refresh] = lastTokenPair;

  const upStatus = await upRequest(access);

  if (upStatus === "env_not_found") {
    return NextResponse.json(
      { message: "Unable to get env variables", status: upStatus },
      { status: 400 }
    );
  }

  if (upStatus === "completed") {
    return NextResponse.json(
      { message: "Up completed!", status: upStatus },
      { status: 200 }
    );
  }

  if (upStatus === "limit_exceeded") {
    return NextResponse.json(
      { message: "Limit exceeded", status: upStatus },
      { status: 400 }
    );
  }

  if (upStatus === "unknown") {
    return NextResponse.json(
      { message: "Something went wrong!", status: upStatus },
      { status: 400 }
    );
  }

  const newTokens = await retrieveNewTokens();
  if (!newTokens) {
    return NextResponse.json(
      { message: "Unable to get new session", status: "new_session_error" },
      { status: 400 }
    );
  }
  saveNewTokens(newTokens.access_token, newTokens.refresh_token);
  const upStatusRetry = await upRequest(newTokens.access_token);

  if (upStatusRetry === "completed") {
    return NextResponse.json(
      { message: "Up completed with new tokens!", status: upStatusRetry },
      { status: 200 }
    );
  }

  if (upStatusRetry === "limit_exceeded") {
    return NextResponse.json(
      { message: "Limit exceeded with new tokens", status: upStatusRetry },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Something went wrong!", status: upStatusRetry },
    { status: 400 }
  );
};
