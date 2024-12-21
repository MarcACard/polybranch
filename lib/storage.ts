export const StorageKeys = {
  PROVIDER_KEYS: "polybranch_provider_keys",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export const storage = {
  /**
   * Get data from localStorage
   */
  get: <T>(key: StorageKey): T | null => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      const parsed = JSON.parse(data) as T;
      return parsed;
    } catch (error) {
      console.error(
        `Error retreiving data from localStorage for key: ${key}`,
        error
      );
      return null;
    }
  },
  /**
   * Set data in localStorage
   */
  set: <T>(key: StorageKey, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error setting data in localStorage for key: ${key}`,
        error
      );
    }
  },
  clear: (key: StorageKey): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Error clearing data from localStorage for key: ${key}`,
        error
      );
    }
  },
};
