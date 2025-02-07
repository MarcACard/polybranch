import { IconType, SiAnthropic, SiGoogle, SiOpenai } from "@icons-pack/react-simple-icons";

import { LLMProvider, ProviderModel } from "@/types/llm";

import { SiXai } from "@/components/custom-icons";

export type ProviderInfo = {
  displayName: string;
  description: string;
  icon: IconType;
  docsUrl: string;
};

export const PROVIDERS: Record<LLMProvider, ProviderInfo> = {
  openai: {
    displayName: "OpenAI",
    description: "",
    icon: SiOpenai,
    docsUrl: "https://platform.openai.com/docs/api-reference/introduction",
  },
  anthropic: {
    displayName: "Anthropic",
    description: "",
    icon: SiAnthropic,
    docsUrl: "https://docs.anthropic.com/en/api/getting-started",
  },
  google: {
    displayName: "Google",
    description: "",
    icon: SiGoogle,
    docsUrl: "https://ai.google.dev/gemini-api/docs",
  },
  xai: {
    displayName: "xAI",
    description: "",
    icon: SiXai,
    docsUrl: "https://docs.x.ai/docs/overview",
  },
};

export const PROVIDER_MODELS: ProviderModel[] = [
  {
    id: "chatgpt-4o-latest",
    displayName: "GPT-4o",
    provider: "openai",
    maxTokens: 128000,
    description: "Our versatile, high-intelligence flagship model",
    price: "$$$",
  },
  {
    id: "gpt-4o-mini",
    displayName: "GPT-4o mini",
    provider: "openai",
    maxTokens: 128000,
    description: "Our fast, affordable small model for focused tasks",
    price: "$",
  },
  {
    id: "gpt-4-turbo",
    displayName: "GPT-4 Turbo",
    provider: "openai",
    maxTokens: 128000,
    description: "The previous set of high-intelligence models",
    price: "$$$",
  },
  {
    id: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    provider: "openai",
    maxTokens: 16385,
    description: "A fast model for simple tasks, superceded by GPT-4o-mini",
    price: "$",
  },
  {
    id: "claude-3-5-sonnet-latest",
    displayName: "Claude 3.5 Sonnet",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Our most intelligent model",
  },
  {
    id: "claude-3-5-haiku-latest",
    displayName: "Claude 3.5 Haiku",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Our fastest model",
  },
  {
    id: "claude-3-opus-latest",
    displayName: "Claude 3 Opus",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Powerful model for highly complex tasks",
  },
  {
    id: "claude-3-sonnet-20240229",
    displayName: "Claude 3 Sonnet",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Balance of intelligence and speed",
  },
  {
    id: "claude-3-haiku-20240307",
    displayName: "Claude 3 Haiku",
    provider: "anthropic",
    maxTokens: 200000,
    description: "Fastest and most compact model for near-instant responsiveness",
  },
  {
    id: "gemini-2.0-flash-exp",
    displayName: "Gemini 2.0 Flash",
    provider: "google",
    maxTokens: 1048576,
    description:
      "Next generation features, speed, and multimodal generation for a diverse variety of tasks",
  },
  {
    id: "gemini-1.5-flash",
    displayName: "Gemini 1.5 Flash",
    provider: "google",
    maxTokens: 1048576,
    description: "Fast and versatile performance across a diverse variety of tasks",
  },
  {
    id: "gemini-1.5-flash-8b",
    displayName: "Gemini 1.5 Flash 8B",
    provider: "google",
    maxTokens: 1048576,
    description: "High volume and lower intelligence tasks",
  },
  {
    id: "gemini-1.5-pro",
    displayName: "Gemini 1.5 Pro",
    provider: "google",
    maxTokens: 2097152,
    description: "Complex reasoning tasks requiring more intelligence",
  },
  {
    id: "grok-2-1212",
    displayName: "Grok 2",
    provider: "xai",
    maxTokens: 131072,
    description:
      "Our latest text model supporting structured outputs, with improved efficiency, speed and capabilities.",
  },
];
