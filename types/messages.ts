import { LLMProvider } from "@/types/llm";
import { LLMRequestMetaData } from "@/types/llm-parameters";

export type MessageRole = "user" | "assistant" | "system";

export interface MessageMetadata {
  modelId?: string;
  requestMetadata?: LLMRequestMetaData;
  tokenCount?: number;
  promptTokens?: number;
  completionTokens?: number;
  requestDuration?: number;
}

export interface Message {
  id: string;
  parentId: string | null;
  role: MessageRole;
  content: string;
  provider?: LLMProvider;
  timestamp: number;
  metadata?: MessageMetadata;
}
