import { TokenStatus } from "./TokenModel";

export type ActivityRequestStatus = "env_not_found" | "completed" | "unknown";

export type ActivityResponseStatus =
  | "items_not_found"
  | ActivityRequestStatus
  | TokenStatus;

export interface Activity {
  user_activity_score: number;
  user_activity_score_change: number;
  show_activity: boolean;
}

export interface ActivityRequest {
  status: ActivityRequestStatus | TokenStatus;
  item_id: string;
  score?: number;
  change?: number;
}

export interface ActivityResult
  extends Omit<ActivityRequest, "status" | "item_id"> {
  item_id?: string;
  status: string;
}

export interface ActivityResponse {
  message: string;
  status: ActivityResponseStatus;
  results?: ActivityResult[];
}
