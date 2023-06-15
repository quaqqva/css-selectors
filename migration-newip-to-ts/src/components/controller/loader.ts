import { RequestMethod, GetResponse, RequestOptions } from '../../utils/request-types';

class Loader {
  private readonly baseLink: string;
  private options: RequestOptions | null;
  constructor(baseLink: string, options: RequestOptions) {
    this.baseLink = baseLink;
    this.options = options;
  }

  protected getResp(
    { endpoint, options = {} }: { endpoint: string; options?: RequestOptions },
    callback = () => {
      console.error('No callback for GET response');
    }
  ): void {
    this.load(RequestMethod.GET, endpoint, callback, options);
  }

  private errorHandler(res: GetResponse): GetResponse {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  protected makeUrl(options: RequestOptions, endpoint: string): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  protected load(
    method: RequestMethod,
    endpoint: string,
    callback: (data: object) => void,
    options: RequestOptions = {}
  ): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data: object) => callback(data))
      .catch((err: Error) => console.error(err));
  }
}

export default Loader;
