// hooks/use-models.ts
import { useState, useEffect } from "react";
import { ModelConfig, LLMProvider } from "@/types/llm";
import { HOSTED_MODELS } from "@/constants/models";
import { StorageKeys, storage } from "@/lib/storage";

export const useModels = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);

  useEffect(() => {
    const stored = storage.get<ModelConfig[]>(StorageKeys.MODELS);
    if (stored) setModels(stored);
  }, []);

  const saveModels = (newModels: ModelConfig[]) => {
    setModels(newModels);
    storage.set(StorageKeys.MODELS, newModels);
  };

  const generateNamespace = (provider: LLMProvider, apiKeyId: string) => {
    return `${provider}-${apiKeyId}`;
  };

  const configureHostedModels = (apiKeyId: string, provider: LLMProvider) => {
    const namespace = generateNamespace(provider, apiKeyId);

    // Filter out old models in this namespace
    const otherModels = models.filter((m) => m.namespace !== namespace);

    // Create new models
    const newModels = HOSTED_MODELS.filter((m) => m.provider == provider).map(
      (model) => ({
        id: crypto.randomUUID(),
        name: model.name,
        modelName: model.modelName,
        provider,
        apiKeyId,
        isHosted: true,
        namespace,
        createdAt: Date.now(),
      })
    );

    saveModels([...otherModels, ...newModels]);
  };

  const addCustomModel = (
    config: Omit<ModelConfig, "id" | "isHosted" | "createdAt">
  ) => {
    // Check for duplicates
    const existing = models.find(
      (m) =>
        m.endpoint == config.endpoint &&
        m.modelName === config.modelName &&
        m.provider === config.provider
    );

    if (existing) {
      const updated = models.map((m) =>
        m.id === existing.id ? { ...m, ...config, isHosted: false } : m
      );
      saveModels(updated);
      return existing.id;
    }

    const newModel: ModelConfig = {
      ...config,
      id: crypto.randomUUID(),
      isHosted: false,
      createdAt: Date.now(),
    };

    saveModels([...models, newModel]);
    return newModel.id;
  };

  const updateApiKeyForProvider = (
    oldKeyId: string,
    newKeyId: string,
    provider: LLMProvider
  ) => {
    const updated = models.map((m) => {
      if (m.provider === provider && m.apiKeyId === oldKeyId) {
        return {
          ...m,
          apiKeyId: newKeyId,
          namespace: generateNamespace(provider, newKeyId),
        };
      }
      return m;
    });
    saveModels(updated);
  };

  const removeModel = (id: string) => {
    const updated = models.filter((m) => m.id !== id);
    saveModels(updated);
  };
  return {
    models,
    configureHostedModels,
    addCustomModel,
    updateApiKeyForProvider,
    removeModel,
  };
};
