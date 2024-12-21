import { useMemo, useCallback } from "react";
import { LLMProvider } from "@/types/llm";
import { PROVIDER_MODELS } from "@/constants/models";
import { useProviderKeys } from "./use-provider-keys";

export const useProviderModels = () => {
  const { hasProviderKey } = useProviderKeys();

  // Get all available models
  const availableModels = useMemo(() => PROVIDER_MODELS, []);

  /**
   * Get all models for a specific provider
   * Only returns models if the provider has an API key configured
   */
  const getModelsForProvider = useCallback(
    (provider: LLMProvider) => {
      if (!hasProviderKey(provider)) return [];
      return availableModels.filter((model) => model.provider == provider);
    },
    [availableModels, hasProviderKey]
  );

  /**
   * Get a specific model by ID
   * Only returns the model if its provider has an API key configured
   */
  const getModelById = useCallback(
    (id: string) => {
      const model = availableModels.find((model) => model.id === id);
      if (!model || !hasProviderKey(model.provider)) return null;
      return model;
    },
    [availableModels, hasProviderKey]
  );

  /** Get all available models across providers with configured API keys */
  const getActiveModels = useCallback(() => {
    return availableModels.filter((model) => hasProviderKey(model.provider));
  }, [availableModels, hasProviderKey]);

  return {
    availableModels,
    getModelsForProvider,
    getModelById,
    getActiveModels,
  };
};
