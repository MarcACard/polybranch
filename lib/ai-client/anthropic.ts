import Anthropic from "@anthropic-ai/sdk";

import { ProviderModel, Messages, ModelConfig } from "@/types/llm";

export async function callAnthropic(
  providerModel: ProviderModel,
  messages: Messages,
  config: ModelConfig,
  apiKey: string,
) {
  const client = new Anthropic({
    apiKey: apiKey,
  });

  const systemMessage = getSystemPrompt(messages);
  const messagesCleaned: { role: "user" | "assistant"; content: string }[] = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

  const requestBody: any = {
    messages: messagesCleaned,
    model: providerModel.id,
  };

  if (systemMessage) requestBody.system = systemMessage;
  if (config.topP) requestBody.top_p = config.topP;
  if (config.maxTokens) requestBody.max_tokens = config.maxTokens;
  if (config.temperature) requestBody.temperature = config.temperature;

  // Call Anthropic
  const chatCompletion = await client.messages.create(requestBody);

  const contentBlock = chatCompletion.content[0];
  let contentString = "";
  if (contentBlock.type == "text") {
    contentString = contentBlock.text;
  }

  return {
    timestamp: "",
    content: contentString,
    provider: "anthropic",
    model: chatCompletion.model,
    tokenCount: chatCompletion.usage?.output_tokens,
  };
}

/**
 * Return a system prompth if its included
 * @param message
 */
function getSystemPrompt(messages: Messages): string | null {
  const systemMessage = messages.find((msg) => msg.role === "system");

  return systemMessage ? systemMessage.content : null;
}
