import { isAxiosError, type AxiosError } from "axios";
import { isProxyError, type ProxyError } from "~/app/types/ProxyError";

export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (isProxyError(error)) {
    return error.originalError as Error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error(String(error));
};

export function isProxyErrorType<T>(
  error: unknown,
  isOriginalError: (e: unknown) => e is T
): error is ProxyError<T> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    'originalError' in error &&
    isOriginalError(error.originalError)
  );
}

export function isProxyAxiosError<T>(error: unknown){
  return isProxyErrorType<AxiosError<T>>(error, isAxiosError);
}