export interface IError {
  value: string;
  type: string;
}

export interface IErrorResponse {
  description: string;
  errors: IError[];
  request_id: string;
}
