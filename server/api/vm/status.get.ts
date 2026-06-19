import { getAzureHttpClient } from '@/api/httpClient';
import { trackProxyError } from '~/server/utils/app-insights';

export default defineEventHandler(async () => {
  try {
    const azureHttpClient = getAzureHttpClient();
    const response = await azureHttpClient.get<string>('vm/status');

    return response.data;
  } catch (error: unknown) {
    const proxy = isProxyAxiosError<string>(error) ? error.originalError : undefined;
    trackProxyError(error, {
      route: '/api/vm/status',
      targetPath: '/api/vm/status',
      method: 'GET',
      upstreamStatus: proxy?.response?.status
    });

    throw createError({
      statusCode: proxy?.response?.status ?? 500,
      statusMessage: proxy?.response?.data ?? proxy?.message ?? 'Failed to fetch VM status',
    });
  }
});
