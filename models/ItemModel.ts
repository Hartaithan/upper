export interface Item {
  id: string;
  name: string;
}

export type ItemsRequestStatus = "env_not_found" | "completed" | "unknown";

export type ItemsResponseStatus = ItemsRequestStatus | "items_not_found";

export interface ItemsResponse {
  status: ItemsResponseStatus;
  items: Item[];
}
