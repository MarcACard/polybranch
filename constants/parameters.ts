import { CoreLLMParameters } from "@/types/llm-parameters";

export const DEFAULT_PARAMETERS: CoreLLMParameters = {
  temperature: 0.7,
  maxTokens: 2048,
};

export const PARAMETER_LIMITS = {
  temperature: {
    min: 0,
    max: 1,
    step: 0.1,
  },
  maxTokens: {
    min: 1,
    max: 4096,
    step: 1,
  },
};
