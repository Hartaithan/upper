"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const manualUp = async (): Promise<string> => {
  try {
    const upRequest = await fetch(API_URL + "/up", { cache: "no-cache" });
    const response = await upRequest.json();
    if (!upRequest.ok) return response?.message ?? "Something went wrong...";
    return response.message;
  } catch (error) {
    return "Something went wrong...";
  }
};
