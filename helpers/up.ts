import { UpRequest } from "@/models/UpModel";
import { baseHeaders } from "./headers";
import { createLog } from "./logs";
import { Error } from "@/models/ErrorModel";

const UP_URL = process.env.NEXT_PUBLIC_SERVICE_UP_URL;

const tokenErrors: string[] = ["bad_authorization", "token_expired"];

export const upRequest = async (access: string): Promise<UpRequest> => {
  if (UP_URL === undefined) {
    return { status: "env_not_found" };
  }

  const headers = { ...baseHeaders, Authorization: `Bearer ${access}` };
  console.info("[UP]: request");
  const request = await fetch(UP_URL, {
    method: "POST",
    headers,
    cache: "no-cache",
  });

  if (request.ok) {
    await createLog();
    console.info("[UP]: completed");
    return { status: "completed" };
  }

  const response = await request.json();
  const errors: Error[] = response.errors || [];
  if (errors.some((err) => err.value === "touch_limit_exceeded")) {
    console.info("[UP]: limit exceeded");
    return { status: "limit_exceeded" };
  }

  if (errors.some((err) => tokenErrors.includes(err.value))) {
    console.info("[UP]: bad authorization");
    return { status: "bad_authorization" };
  }

  console.error("[UP]: error", response);
  return { status: "unknown", response };
};
