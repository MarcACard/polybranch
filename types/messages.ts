import { LLMProvider } from "@/types/llm";
import { LLMRequestMetaData } from "@/types/llm-parameters";

export type MessageRole = "user" | "assistant" | "system";

export type MessageMetadata = {
  modelId?: string;
  requestMetadata?: LLMRequestMetaData;
  tokenCount?: number;
  promptTokens?: number;
  completionTokens?: number;
  requestDuration?: number;
};

export type Message = {
  role: MessageRole;
  content: string;
  provider?: LLMProvider;
  timestamp: number;
  metadata?: MessageMetadata;
};
