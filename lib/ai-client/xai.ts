import OpenAI from "openai";

import { ProviderModel, Messages, ModelConfig } from "@/types/llm";

export async function callXAI(
  providerModel: ProviderModel,
  messages: Messages,
  config: ModelConfig,
  apiKey: string,
) {
  // XAI supports the OpenAI SDK
  // https://docs.x.ai/docs/overview#migrating-from-another-llm-provider
  const client = new OpenAI({
    baseURL: "https://api.x.ai/v1",
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
    content: chatCompletion.choices[0].message.content,
    provider: "xai",
    model: chatCompletion.model,
    tokenCount: chatCompletion.usage?.completion_tokens,
  };
}
