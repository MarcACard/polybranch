import { logger } from "@/lib/logger";
import { LLMProvider } from "@/types/llm";
import { CoreLLMParameters } from "@/types/llm-parameters";
import { Message } from "@/types/messages";
import { useProviderKeys } from "@/hooks/use-provider-keys";

interface LLMCallParams {
  messages: Message[];
  provider: LLMProvider;
  modelId: string;
  parameters?: CoreLLMParameters;
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
      throw new Error(`No API key found for provider: ${provider}`);
    }

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          model: modelId,
          messages,
          parameters,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error("LLM API returned an error", errorData);
        throw new Error(errorData.error || "LLM API error");
      }

      // 2. Return the JSON data
      const data = await response.json();
      logger.debug("LLM API response received", data);
      return data;
    } catch (error) {
      logger.error("LLM call failed", error);
      throw error;
    }
  };

  return { callAPI };
};