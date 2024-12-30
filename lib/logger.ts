const isDev = process.env.NODE_ENV === "development";

export const logger = {
  debug: (message: string, data?: any) => {
    if (isDev) {
      console.debug(`🔍 ${message}`, data || "");
    }
  },

  info: (message: string, data?: any) => {
    if (isDev) {
      console.info(`ℹ️ ${message}`, data || "");
    }
  },

  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(`⚠️ ${message}`, data || "");
    }
  },

  error: (message: string, error?: any) => {
    if (isDev) {
      console.error(`🔥 ${message}`, error || "");
    }
  },
};
