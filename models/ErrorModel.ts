export interface Error {
  value: string;
  type: string;
}

export interface ErrorResponse {
  description: string;
  errors: Error[];
  request_id: string;
}
