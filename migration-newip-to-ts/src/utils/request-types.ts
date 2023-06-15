export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export type GetResponse = Pick<Response, 'ok' | 'status' | 'statusText' | 'json'>;

export type RequestOptions = {
  [option: string]: string;
};
