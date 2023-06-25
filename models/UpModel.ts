export type UpRequestStatus =
  | "env_not_found"
  | "completed"
  | "limit_exceeded"
  | "bad_authorization"
  | "unknown";

export type UpResponseStatus =
  | UpRequestStatus
  | "tokens_not_found"
  | "active_tokens_not_found"
  | "new_session_error";

export interface UpResponse {
  message: string;
  status: UpResponseStatus;
}
