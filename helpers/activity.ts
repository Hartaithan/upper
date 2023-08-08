import { Activity, ActivityRequest } from "@/models/ActivityModel";
import { baseHeaders } from "./headers";

const ACTIVITY_URL = process.env.NEXT_PUBLIC_SERVICE_ACTIVITY_URL;

export const activityRequest = async (
  access: string,
  item_id: string
): Promise<ActivityRequest> => {
  if (ACTIVITY_URL === undefined) return { status: "env_not_found" };

  console.info("[ACTIVITY]: request, item_id: " + item_id);
  const url = ACTIVITY_URL + `&vacancy_id=${item_id}`;
  const headers = { ...baseHeaders, Authorization: `Bearer ${access}` };
  const request = await fetch(url, { headers });
  const response = await request.json();

  if (request.ok) {
    console.info("[ACTIVITY]: completed, item_id: " + item_id);
    const activity: Activity = response;
    const score = activity.user_activity_score ?? null;
    const change = activity.user_activity_score_change ?? null;
    return {
      status: "completed",
      message: `item_id: ${item_id}, score: ${score}, change: ${change}`,
    };
  }

  console.error("[ACTIVITY]: error, item_id: " + item_id, response);
  return { status: "unknown" };
};
