import { callOpenAI } from "./openai";
import { callXAI } from "./xai";
import { callAnthropic } from "./anthropic";

import { ProviderModel, ModelConfig, Messages } from "@/types/llm";

export interface LLMRequest {
  providerModel: ProviderModel;
  messages: Messages;
  config: ModelConfig;
  apiKey: string;
}

// === Server-Side ===
export async function callProvider(params: LLMRequest) {
  const { providerModel, messages, config, apiKey } = params;

  switch (providerModel.provider) {
    case "openai":
      return callOpenAI(providerModel, messages, config, apiKey);
    case "anthropic":
      return callAnthropic(providerModel, messages, config, apiKey);
    case "xai":
      return callXAI(providerModel, messages, config, apiKey);
    // case "google":
    //   return callGoogle(providerModel, messages, config, apiKey);
    default:
      throw new Error(`Unsupported Provider: ${providerModel.provider}`);
  }
}

// === Client-Side ===
export async function sendLLMRequest({ providerModel, messages, config, apiKey }: LLMRequest) {
  console.log("sendLLMRequest - Call Serverless API");
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providerModel, messages, config, apiKey }),
  });

  if (!res.ok) {
    throw new Error("Failed to call /api/llm");
  }

  console.log("sendLLMRequest - request complete", res);
  return res.json();
}
