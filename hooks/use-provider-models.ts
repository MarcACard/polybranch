import { useCallback } from "react";

import { useApiKeys } from "@/contexts/api-key-context";

import { PROVIDER_MODELS } from "@/constants/models";
import { LLMProvider } from "@/types/llm";

export const useProviderModels = () => {
  const { hasApiKey } = useApiKeys();

  const availableModels = PROVIDER_MODELS;

  /**
   * Get all models for a specific provider
   * Only returns models if the provider has an API key configured
   */
  const getModelsForProvider = useCallback(
    (provider: LLMProvider) => {
      if (!hasApiKey(provider)) return [];
      return availableModels.filter((model) => model.provider === provider);
    },
    [hasApiKey],
  );

  /**
   * Get a specific model by ID
   * Only returns the model if its provider has an API key configured
   */
  const getModelById = useCallback(
    (id: string) => {
      const model = availableModels.find((model) => model.id === id);
      if (!model || !hasApiKey(model.provider)) return null;
      return model;
    },
    [hasApiKey],
  );

  /** Get all available models across providers with configured API keys */
  const getActiveModels = useCallback(
    () => availableModels.filter((model) => hasApiKey(model.provider)),
    [hasApiKey],
  );

  return {
    availableModels,
    getModelsForProvider,
    getModelById,
    getActiveModels,
  };
};
