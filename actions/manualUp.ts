"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const manualUp = async () => {
  if (!API_URL) return "Unable to get ENV variables";
  const upRequest = await fetch(API_URL + "/up", { cache: "no-cache" });
  if (!upRequest.ok) {
    const response = await upRequest.json();
    return response?.message ?? "Something went wrong...";
  }
  revalidatePath("/");
};
