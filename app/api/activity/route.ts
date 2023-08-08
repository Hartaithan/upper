import { getTokens } from "@/helpers/token";
import { ActivityResponse } from "@/models/ActivityModel";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse<ActivityResponse>> => {
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

  return NextResponse.json(
    {
      message: "Something went wrong!",
      status: "unknown",
    },
    { status: 400 }
  );
};
