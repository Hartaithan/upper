import { UpRequestStatus } from "@/models/UpModel";
import { baseHeaders } from "./headers";
import { createLog } from "./logs";
import { IError } from "@/models/ErrorModel";

const UP_URL = process.env.NEXT_PUBLIC_SERVICE_UP_URL;

export const upRequest = async (access: string): Promise<UpRequestStatus> => {
  if (UP_URL === undefined) {
    return "env_not_found";
  }

  const headers = { ...baseHeaders, Authorization: `Bearer ${access}` };
  console.info("[UP]: request");
  const request = await fetch(UP_URL, { method: "POST", headers });

  if (request.ok) {
    await createLog();
    console.info("[UP]: completed");
    return "completed";
  }

  const response = await request.json();
  const errors: IError[] = response.errors || [];
  if (errors.some((err) => err.value === "touch_limit_exceeded")) {
    console.info("[UP]: limit exceeded");
    return "limit_exceeded";
  }

  if (errors.some((err) => err.value === "bad_authorization")) {
    console.info("[UP]: bad authorization");
    return "bad_authorization";
  }

  console.error("[UP]: error", response);
  return "unknown";
};
