// Provider Definitions
export const LLMProviders = ["openai", "anthropic", "google", "xai"] as const;
export type LLMProvider = (typeof LLMProviders)[number];

// API Key Management
export type ProviderApiKey = {
  provider: LLMProvider;
  key: string;
  lastUpdated: number;
};

// Model Definitions
export type ProviderModel = {
  id: string;
  displayName: string;
  provider: LLMProvider;
  maxTokens?: number;
  description?: string;
};

// LLM Parameters for Configuration
export const LLM_PARAMETER_KEYS = ["topP", "temperature", "maxTokens"] as const;
export type LLMParameterKey = (typeof LLM_PARAMETER_KEYS)[number];

export type ModelConfig = Partial<Record<LLMParameterKey, number>>;

// Messages
export type MessageRole = "user" | "assistant" | "system";

export type Message = {
  role: MessageRole;
  content: string;
};

export type Messages = Message[];
