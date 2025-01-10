import { type StorageKey } from "@/types/storage";

export const storage = {
  /**
   * Get data from localStorage
   */
  get: <T>(key: StorageKey): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retreiving data from localStorage for key: ${key}`, error);
      return null;
    }
  },
  /**
   * Set data in localStorage
   */
  set: <T>(key: StorageKey, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting data in localStorage for key: ${key}`, error);
    }
  },
  /**
   * Clear entire Storage Item from localStorage
   */
  clear: (key: StorageKey): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing data from localStorage for key: ${key}`, error);
    }
  },
};
