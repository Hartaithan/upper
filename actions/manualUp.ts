"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const manualUp = async () => {
  if (!API_URL) {
    console.error("Unable to get ENV variables");
    return;
  }
  const upRequest = await fetch(API_URL + "/up");
  if (!upRequest.ok) {
    const response = await upRequest.text();
    console.error(response);
    return;
  }
  revalidatePath("/");
};
