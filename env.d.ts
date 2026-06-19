declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.css';

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    azureFunctionUrl: string
    apiFunctionMasterKey: string
    applicationinsightsConnectionString: string
  }
  interface PublicRuntimeConfig {
  }
}

export { }