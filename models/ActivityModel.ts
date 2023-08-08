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
  message?: string;
}

export interface ActivityResult {
  message: string;
  status: string;
}

export interface ActivityResponse {
  message: string;
  status: ActivityResponseStatus;
  results?: ActivityResult[];
}
