import type { RuntimeConfig } from 'nuxt/schema';
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime';

export const requiredRuntimeConfigKeys = [
  'azureFunctionUrl',
  'apiFunctionMasterKey',
] as const satisfies readonly Extract<keyof RuntimeConfig, string>[];

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig();
  const missing = requiredRuntimeConfigKeys.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || !value.trim();
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required runtime config value(s): ${missing.join(', ')}. ` +
      'Set these values in runtimeConfig before starting the server.'
    );
  }
});
