import appInsights from 'applicationinsights';
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime';

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig();

  if (!config.applicationinsightsConnectionString) return;

  if (!appInsights.defaultClient) {
    appInsights
      .setup(config.applicationinsightsConnectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectExceptions(true)
      .setUseDiskRetryCaching(true)
      .start();
  }
});