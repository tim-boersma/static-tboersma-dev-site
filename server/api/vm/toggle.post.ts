import { getAzureHttpClient } from '@/api/httpClient';
import { trackProxyError } from '~/server/utils/app-insights';
import { isProxyAxiosError } from '~/server/utils/lib';

interface ToggleBody {
  state: boolean;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ToggleBody>(event);

  if (typeof body?.state !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body must include boolean state',
    });
  }

  try {
    const azureHttpClient = getAzureHttpClient();

    const response = await azureHttpClient.put(`vm/manual?state=${body.state}`);

    return response.data;
  } catch (error: unknown) {
    const proxy = isProxyAxiosError<string>(error) ? error.originalError : undefined;
    trackProxyError(error, {
      route: '/api/vm/toggle',
      targetPath: `/api/vm/manual?state=${body.state}`,
      method: 'PUT',
      upstreamStatus: proxy?.response?.status,
      upstreamMessage: proxy?.response?.data ?? proxy?.message
    });

    throw createError({
      statusCode: proxy?.response?.status ?? 500,
      statusMessage: proxy?.response?.data ?? proxy?.message ?? 'Failed to toggle VM',
    });
  }
});
