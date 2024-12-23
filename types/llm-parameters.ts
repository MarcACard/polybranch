import { LLMProvider } from "@/types/llm";

export const LLMParameters = ["topP", "temperature", "maxTokens"] as const;
export type LLMParameter = (typeof LLMParameters)[number];

export interface CoreLLMParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number
}

export type ProviderSpecificParameters = {
  [K in LLMProvider]?: Record<string, unknown>;
};

export interface LLMRequestMetaData {
    parameters: CoreLLMParameters;
    providerSpecific?: ProviderSpecificParameters;
}