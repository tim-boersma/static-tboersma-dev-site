import axios, { type AxiosInstance } from 'axios';

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
  return new HttpClient(options).client;
};

export const getAzureHttpClient = (): AxiosInstance => {
  const runtimeConfig = useRuntimeConfig();

  if (!runtimeConfig.azureFunctionUrl) {
    throw new Error('Missing azureFunctionUrl runtime config');
  }

  if (!runtimeConfig.apiFunctionMasterKey) {
    throw new Error('Missing apiFunctionMasterKey runtime config');
  }

  return createHttpClient({
    baseURL: runtimeConfig.azureFunctionUrl,
    headers: {
      'x-functions-key': runtimeConfig.apiFunctionMasterKey,
    },
  });
};
export const getProxyHttpClient = (): AxiosInstance => {
  return createHttpClient({
    baseURL: '/api',
  });
};
