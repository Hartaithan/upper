export type ActivityRequestStatus = "env_not_found" | "completed" | "unknown";

export type ActivityResponseStatus = ActivityRequestStatus;

export interface Activity {
  user_activity_score: number;
  user_activity_score_change: number;
  show_activity: boolean;
}

export interface ActivityRequest {
  status: ActivityRequestStatus;
  message?: string;
}
