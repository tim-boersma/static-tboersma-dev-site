import appInsights from 'applicationinsights';
import { toError } from '~/server/utils/lib';

export interface ProxyErrorContext {
  route: string;
  targetPath: string;
  method: string;
  upstreamStatus?: number;
  upstreamMessage?: string;
}

export const trackProxyError = (error: unknown, context: ProxyErrorContext): void => {
  const client = appInsights.defaultClient;

  if (!client) {
    return;
  }

  const trackedError = toError(error);
  try {
    client.trackException({
      exception: trackedError,
      properties: {
        route: context.route,
        targetPath: context.targetPath,
        method: context.method,
        upstreamStatus: context.upstreamStatus ? String(context.upstreamStatus) : 'unknown',
      },
    });
    client.flush();
  }
  catch (err) { console.error(err) }
};
