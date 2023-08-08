import { Item, ItemsResponse } from "@/models/ItemModel";
import { baseHeaders } from "./headers";

const ITEMS_URL = process.env.NEXT_PUBLIC_SERVICE_ITEMS_URL;

export const getItems = async (
  page: number = 0,
  per_page: number = 20,
  query: string = "frontend"
): Promise<ItemsResponse> => {
  if (ITEMS_URL === undefined) return { status: "env_not_found", items: [] };

  console.info("[ITEMS]: request");
  const url = ITEMS_URL + `&page=${page}&per_page=${per_page}&text=${query}`;
  const request = await fetch(url, { headers: baseHeaders });
  const response = await request.json();

  const items: Item[] = response.items || [];

  if (request.ok && items && items.length === 0) {
    console.info("[ITEMS]: items not found");
    return { status: "items_not_found", items };
  }

  if (request.ok) {
    console.info("[ITEMS]: completed");
    return { status: "completed", items };
  }

  console.error("[ITEMS]: error", response);
  return { status: "unknown", items: [] };
};
