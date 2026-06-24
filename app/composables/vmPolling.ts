export interface PollingConfig {
  normalInterval: number;
  fastInterval: number;
  fastDuration: number;
}

export const DEFAULT_POLLING_CONFIG: PollingConfig = {
  normalInterval: 30000, // 30 seconds
  fastInterval: 1000,    // 1 second
  fastDuration: 120000,   // 2 minutes
};

export function createPollingController(config: PollingConfig = DEFAULT_POLLING_CONFIG) {
  let pollingInterval: ReturnType<typeof setInterval> | null = null;
  let fastPollingTimeout: ReturnType<typeof setTimeout> | null = null;
  let isNormalPolling = true;

  return {
    startNormalPolling(callback: () => void): void {
      if (pollingInterval) clearInterval(pollingInterval);

      isNormalPolling = true;

      // Poll immediately, then set up interval
      callback();

      pollingInterval = setInterval(() => {
        if (isNormalPolling) {
          callback();
        }
      }, config.normalInterval);
    },

    startFastPolling(callback: () => void): void {
      isNormalPolling = false;

      // Clear existing fast polling timeout
      if (fastPollingTimeout) clearTimeout(fastPollingTimeout);

      // Poll immediately
      callback();

      // Set up fast interval
      if (pollingInterval) clearInterval(pollingInterval);

      pollingInterval = setInterval(() => {
        callback();
      }, config.fastInterval);

      // After duration, return to normal polling
      fastPollingTimeout = setTimeout(() => {
        this.startNormalPolling(callback);
      }, config.fastDuration);
    },

    stopPolling(): void {
      if (pollingInterval) clearInterval(pollingInterval);
      if (fastPollingTimeout) clearTimeout(fastPollingTimeout);
      isNormalPolling = false;
    },

    get isNormalPolling() {
      return isNormalPolling;
    },
  };
}
