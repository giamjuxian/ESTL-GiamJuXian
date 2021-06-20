import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000, // 10 seconds timeout
});

interface APIOptions {
  url: string;
  type: APIType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

interface APIData<T> {
  results: T;
}

export enum APIType {
  get = "get",
  post = "post",
  put = "put",
}

export async function fetchAPI<T>(
  options: APIOptions,
  config?: AxiosRequestConfig
): Promise<T | null> {
  const { url, type, body } = options;

  try {
    let response: AxiosResponse<APIData<T>>;
    switch (type) {
      case APIType.get:
        response = await instance.get<APIData<T>>(url, config);
        break;
      case APIType.post:
        response = await instance.post<APIData<T>>(url, body, config);
        break;
      case APIType.put:
        response = await instance.put<APIData<T>>(url, body, config);
        break;
    }
    return response.data && response.data.results;
  } catch (error) {
    const err: AxiosError = error;
    if (err.response) {
      const message = err.response.data.error.message;
      throw new Error(message);
    }
  }
  return null;
}
