import { useState, useEffect, useCallback } from "react";
import { ProviderApiKey, LLMProvider } from "@/types/llm";

import { StorageKeys, storage } from "@/lib/storage";

export const useProviderKeys = () => {
  const [providerKeys, setProviderKeys] = useState<ProviderApiKey[]>([]);

  // Load stored keys on mount
  useEffect(() => {
    const stored = storage.get<ProviderApiKey[]>(StorageKeys.PROVIDER_KEYS);
    if (stored) setProviderKeys(stored);
  }, []);

  const saveKeys = useCallback((keys: ProviderApiKey[]) => {
    setProviderKeys(keys);
    storage.set(StorageKeys.PROVIDER_KEYS, keys);
  }, []);

  /**
   * Set or update a provider's API Key
   * Returns true if this was an update to an existing key
   */
  const setProviderKey = useCallback(
    (provider: LLMProvider, key: string): boolean => {
      const isUpdated = providerKeys.some((p) => p.provider === provider);

      const updated = providerKeys.filter((p) => p.provider !== provider);
      const newKey: ProviderApiKey = {
        provider,
        key,
        lastUpdated: Date.now(),
      };

      saveKeys([...updated, newKey]);
      return isUpdated;
    },
    [providerKeys, saveKeys]
  );

  /**
   * Remove a provider's API key from storage
   */
  const removeProviderKey = useCallback(
    (provider: LLMProvider) => {
      const updated = providerKeys.filter((p) => p.provider !== provider);
      saveKeys(updated);
    },
    [providerKeys, saveKeys]
  );

  /**
   * Get a provider's API Key from storage
   */
  const getProviderKey = useCallback(
    (provider: LLMProvider) => {
      return providerKeys.find((p) => p.provider === provider)?.key;
    },
    [providerKeys]
  );

  /**
   * Check if a provider has an API key configured
   */
  const hasProviderKey = useCallback(
    (provider: LLMProvider) => {
      return providerKeys.some((p) => p.provider === provider);
    },
    [providerKeys]
  );

  return {
    providerKeys,
    setProviderKey,
    removeProviderKey,
    getProviderKey,
    hasProviderKey,
  };
};
