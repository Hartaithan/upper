import { activityRequest } from "@/helpers/activity";
import { getItems } from "@/helpers/items";
import { getTokens } from "@/helpers/token";
import { ActivityResponse, ActivityResult } from "@/models/ActivityModel";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse<ActivityResponse>> => {
  const [tokensRes, itemsRes] = await Promise.allSettled([
    await getTokens(),
    await getItems(),
  ]);

  if (tokensRes.status === "rejected" || tokensRes.value === null) {
    return NextResponse.json(
      { message: "Unable to get tokens", status: "tokens_not_found" },
      { status: 400 }
    );
  }

  if (itemsRes.status === "rejected" || itemsRes.value.items.length === 0) {
    return NextResponse.json(
      { message: "Unable to get items", status: "items_not_found" },
      { status: 400 }
    );
  }

  const tokens = tokensRes.value;
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

  const items = itemsRes.value.items;
  const requests = items.map((i) => activityRequest(access, i.id));

  try {
    const responses = await Promise.allSettled(requests);
    const results: ActivityResult[] = responses.map((response) => {
      if (response.status === "rejected") return { status: response.status };
      return {
        ...response.value,
        status: response.status,
      };
    });
    return NextResponse.json(
      {
        message: "Activity requests completed",
        status: "completed",
        results,
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong!",
        status: "unknown",
      },
      { status: 400 }
    );
  }
};
