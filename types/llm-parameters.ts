import { LLMProvider } from "@/types/llm";

export interface CoreLLMParameters {
  temperature?: number;
  maxTokens?: number;
}

export type ProviderSpecificParameters = {
  [K in LLMProvider]?: Record<string, unknown>;
};

export interface LLMRequestMetaData {
    parameters: CoreLLMParameters;
    providerSpecific?: ProviderSpecificParameters;
}