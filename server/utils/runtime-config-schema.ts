import type { RuntimeConfig } from 'nuxt/schema';

type RuntimeConfigKey = Extract<keyof RuntimeConfig, string>;

export const requiredRuntimeConfigKeys = [
  'azureFunctionUrl',
  'apiFunctionMasterKey',
] as const satisfies readonly RuntimeConfigKey[];

