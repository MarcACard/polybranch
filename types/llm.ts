// Provider Definitions
export const LLMProviders = ["openai", "anthropic", "google", "xai"] as const;
export type LLMProvider = (typeof LLMProviders)[number];

// API Key Management
export interface ProviderApiKey {
  provider: LLMProvider;
  key: string;
  lastUpdated: number;
}

// Model Definitions
export interface ProviderModel {
  id: string;
  name: string;
  modelName: string;
  provider: LLMProvider;
  maxTokens?: number;
  description?: string;
}

