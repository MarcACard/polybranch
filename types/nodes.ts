import { Node } from "@xyflow/react";
import { LLMProvider, ProviderModel, Message, ModelConfig } from "@/types/llm";

export type MessageNodeData = {
  message: Message;
  timestamp: number;
  tokenCount?: number;
  provider?: LLMProvider;
  providerModel?: ProviderModel;
  modelConfig?: ModelConfig;
};

export type MessageNode = Node<MessageNodeData>;
