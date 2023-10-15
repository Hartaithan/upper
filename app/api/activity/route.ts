import { activityRequest } from "@/helpers/activity";
import { getItems } from "@/helpers/items";
import { getActiveTokens } from "@/helpers/token";
import { ActivityResponse, ActivityResult } from "@/models/ActivityModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (): Promise<NextResponse<ActivityResponse>> => {
  const [tokensRes, itemsRes] = await Promise.allSettled([
    await getActiveTokens(),
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

  const {
    created_at: _created_at,
    access_token: access,
    refresh_token: _refresh,
  } = tokensRes.value;

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
      { status: 200 }
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
