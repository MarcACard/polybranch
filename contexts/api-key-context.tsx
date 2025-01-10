"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

import { storage } from "@/lib/local-storage";
import { StorageKeys } from "@/constants/storage-keys";
import { LLMProvider, ProviderApiKey } from "@/types/llm";

interface ApiKeyContextType {
  apiKeys: ProviderApiKey[];
  setApiKey: (provider: LLMProvider, key: string) => void;
  getApiKey: (provider: LLMProvider) => ProviderApiKey | null;
  removeApiKey: (provider: LLMProvider) => void;
  hasApiKey: (provider: LLMProvider) => boolean;
}

export const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

export default function ApiKeyContextProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ProviderApiKey[]>(() => {
    return storage.get(StorageKeys.PROVIDER_KEYS) ?? [];
  });

  // Ensure Local Storage Stays in Sync with any State Changes
  useEffect(() => {
    storage.set(StorageKeys.PROVIDER_KEYS, apiKeys);
  }, [apiKeys]);

  const setApiKey = useCallback((provider: LLMProvider, key: string) => {
    const newApiKey: ProviderApiKey = {
      provider,
      key,
      lastUpdated: Date.now(),
    };

    // Functional Update Pattern
    // https://react.dev/reference/react/useState#setstate-parameters
    setApiKeys((prev) => {
      const updated = prev.filter((key) => key.provider !== provider);
      return [...updated, newApiKey];
    });
  }, []);

  const removeApiKey = useCallback((provider: LLMProvider) => {
    // Functional Update Pattern
    // https://react.dev/reference/react/useState#setstate-parameters
    setApiKeys((prev) => {
      return prev.filter((key) => key.provider !== provider);
    });
  }, []);

  const getApiKey = useCallback(
    (provider: LLMProvider): ProviderApiKey | null => {
      return apiKeys.find((key) => key.provider === provider) ?? null;
    },
    [apiKeys],
  );

  const hasApiKey = useCallback(
    (provider: LLMProvider): boolean => {
      return apiKeys.some((key) => key.provider === provider);
    },
    [apiKeys],
  );

  return (
    <ApiKeyContext.Provider value={{ apiKeys, setApiKey, getApiKey, removeApiKey, hasApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKeys() {
  const context = useContext(ApiKeyContext);

  if (!context) {
    throw new Error("useApiKes must be used within an ApiKeyProvider");
  }

  return context;
}
