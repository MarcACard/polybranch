import OpenAI from "openai";

import { ProviderModel, Messages, ModelConfig } from "@/types/llm";

export async function callOpenAI(
  providerModel: ProviderModel,
  messages: Messages,
  config: ModelConfig,
  apiKey: string,
) {
  // OpenAI content DS is PolyBranch's default structure, no manipulation to messages needed.
  // Init OpenAI SDK
  const client = new OpenAI({
    apiKey: apiKey,
  });

  // Call OpenAI
  const chatCompletion = await client.chat.completions.create({
    messages: messages,
    model: providerModel.id,
    top_p: config.topP,
    max_completion_tokens: config.maxTokens,
    temperature: config.temperature,
  });

  return {
    timestamp: chatCompletion.created,
    content: chatCompletion.choices[0].message,
    provider: "openai",
    model: chatCompletion.model,
    tokenCount: chatCompletion.usage?.completion_tokens,
  };
}
