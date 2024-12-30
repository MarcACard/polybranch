import { logger } from "@/lib/logger";
import { LLMProvider } from "@/types/llm";
import { Message } from "@/types/messages";
import { useProviderKeys } from "@/hooks/use-provider-keys";

interface LLMCallParams {
  messages: Message[];
  provider: LLMProvider;
  modelId: string;
  parameters?: Record<string, any>;
}

async function callAnthropicAPI({
  messages,
  modelId,
  parameters,
  apiKey,
}: LLMCallParams & { apiKey: string }) {
  logger.debug("Calling Anthropic API", { modelId });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        // 'anthropic-version': '2023-06-01 LOOK INTO THIS
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        ...parameters,
      }),
    });

    if (!response.ok) {
      logger.error("Anthropic API error", { status: response.status });
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    logger.debug("Anthropic API response received");
    return data;
  } catch (error) {
    logger.error("Antrhopic API call failed", error);
    throw error;
  }
}

async function callOpenAIAPI({
  messages,
  modelId,
  parameters,
  apiKey,
}: LLMCallParams & { apiKey: string }) {
  logger.debug("Calling OpenAI API", { modelId });

  try {
    // TODO: LOOK INTO THIS CALL STRUCTURE.
    const response = await fetch("https://api.openai.com/v1/chat/compleions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages.map((msg) => ({
          role: msg.role,
          conent: msg.content,
        })),
        ...parameters,
      }),
    });

    if (!response.ok) {
      logger.error("OpenAI API error", { status: response.status });
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    logger.debug("OpenAI API response received");
    return data;
  } catch (error) {
    logger.error("OpenAI API call failed", error);
  }
}

export const useLLMAPI = () => {
  const { getProviderKey } = useProviderKeys();

  const callAPI = async ({
    messages,
    provider,
    modelId,
    parameters,
  }: LLMCallParams) => {
    logger.info("Starting API call", { provider, modelId });

    const apiKey = getProviderKey(provider);
    if (!apiKey) {
      logger.error("API key missing", { provider });
    }

    try {
      switch (provider) {
        case "anthropic":
          return await callAnthropicAPI({
            messages,
            modelId,
            parameters,
            apiKey,
          });
        case "openai":
          return await callOpenAIAPI({ messages, modelId, parameters, apiKey });
        default:
          logger.error("Unsupporeted provider", { provider });
          throw new Error(`Unsuppored provider: ${provider}`);
      }
    } catch (error) {
      throw error;
    }
  };

  return { callAPI };
};
