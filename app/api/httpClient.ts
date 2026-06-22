import axios, { type AxiosInstance, type AxiosRequestHeaders } from 'axios';

type HeaderMap = Record<string, string>;

export interface HttpClientOptions {
  baseURL: string;
  timeout?: number;
  headers?: HeaderMap;
}

const normalizeBaseUrl = (baseUrl: string): string => {
  const normalizedBase = baseUrl.trim().replace(/\/+$/, '');
  return normalizedBase.endsWith('/') ? normalizedBase : `${normalizedBase}/`;
};

export class HttpClient {
  public readonly instance: AxiosInstance;
  private baseURL: string;

  constructor(options: HttpClientOptions) {
    this.baseURL = normalizeBaseUrl(options.baseURL);

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: options.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        const status = error.response?.status;

        console.error(`API Error [${status}]:`, message);

        return Promise.reject({
          status,
          message,
          originalError: error,
        });
      }
    );
  }

  get client(): AxiosInstance {
    return this.instance;
  }
}

export const createHttpClient = (options: HttpClientOptions): AxiosInstance => {
  if(isPrerender()) {
    console.warn('Prerender mode detected - returning dummy HTTP client');
    return axios.create({
      baseURL: '',
      adapter: async () => {
        return {
          data: null,
          status: 204,
          statusText: 'No Content (prerender)',
          headers: {},
          config: { headers: {} as AxiosRequestHeaders },
        };
      },
    });
  }
  return new HttpClient(options).client;
};

export const isPrerender = () =>
  import.meta.prerender;

export const getProxyHttpClient = (): AxiosInstance => {
  return createHttpClient({
    baseURL: '/api',
  });
};
