export interface ProxyError<T = unknown> {
  status: number;
  message: string;
  originalError: T;
}

export function isProxyError(error: unknown): error is ProxyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    'originalError' in error
  );
}