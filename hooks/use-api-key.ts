//hooks/use-api-key.ts
import { useState, useEffect } from "react";
import { ApiKeyConfig } from "@/types/llm";
import { StorageKeys, storage } from "@/lib/storage";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);

  useEffect(() => {
    const stored = storage.get<ApiKeyConfig[]>(StorageKeys.API_KEYS);
    if (stored) setApiKeys(stored);
  }, []);

  const saveKeys = (keys: ApiKeyConfig[]) => {
    setApiKeys(keys);
    storage.set(StorageKeys.API_KEYS, keys);
  };

  const addApiKey = (config: Omit<ApiKeyConfig, "id" | "createdAt">) => {
    const newKey: ApiKeyConfig = {
      ...config,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const updated = [...apiKeys, newKey];
    saveKeys(updated);
    return newKey.id;
  };

  const updateApiKey = (id: string, newKey: string) => {
    const updated = apiKeys.map((key) =>
      key.id === id ? { ...key, key: newKey } : key
    );
    saveKeys(updated);
  };

  const removeApiKey = (id: string) => {
    const updated = apiKeys.filter((key) => key.id !== id);
    saveKeys(updated);
  };

  const getApiKey = (id: string) => {
    return apiKeys.find((key) => key.id === id);
  };

  return {
    apiKeys,
    addApiKey,
    updateApiKey,
    removeApiKey,
    getApiKey,
  };
};
