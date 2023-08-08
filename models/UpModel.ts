import { TokenStatus } from "./TokenModel";

export type UpRequestStatus =
  | "env_not_found"
  | "completed"
  | "limit_exceeded"
  | "bad_authorization"
  | "unknown";

export type UpResponseStatus =
  | UpRequestStatus
  | TokenStatus
  | "new_session_error";

export interface UpResponse {
  message: string;
  status: UpResponseStatus;
}

export interface UpRequest {
  status: UpRequestStatus;
  response?: unknown;
}
