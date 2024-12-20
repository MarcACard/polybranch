import { HostedModel } from "@/types/llm"

export const HOSTED_MODELS: HostedModel[] = [
    {
        name: "GPT-4o",
        modelName: "chatgpt-4o-latest",
        provider: "openai",
        maxTokens: 128000,
        description: "Our versatile, high-intelligence flagship model"
    },
    {
        name: "GPT-4o mini",
        modelName: "gpt-4o-mini",
        provider: "openai",
        maxTokens: 128000,
        description: "Our fast, affordable small model for focused tasks"
    },
    {
        name: "GPT-4 Turbo",
        modelName: "gpt-4-turbo",
        provider: "openai",
        maxTokens: 128000,
        description: "The previous set of high-intelligence models"
    },
    {
        name: "GPT-3.5 Turbo",
        modelName: "gpt-3.5-turbo",
        provider: "openai",
        maxTokens: 16385,
        description: "A fast model for simple tasks, superceded by GPT-4o-mini"
    },
    {
        name: "Claude 3.5 Sonnet",
        modelName: "claude-3-5-sonnet-latest",
        provider: "anthropic",
        maxTokens: 200000,
        description: "Our most intelligent model"
    },
    {
        name: "Claude 3.5 Haiku",
        modelName: "claude-3-5-haiku-latest",
        provider: "anthropic",
        maxTokens: 200000,
        description: "Our fastest model"
    },
    {
        name: "Claude 3 Opus",
        modelName: "claude-3-opus-latest",
        provider: "anthropic",
        maxTokens: 200000,
        description: "Powerful model for highly complex tasks"
    },
    {
        name: "Claude 3 Sonnet",
        modelName: "claude-3-sonnet-20240229",
        provider: "anthropic",
        maxTokens: 200000,
        description: "Balance of intelligence and speed"
    },
    {
        name: "Claude 3 Haiku",
        modelName: "claude-3-haiku-20240307",
        provider: "anthropic",
        maxTokens: 200000,
        description: "Fastest and most compact model for near-instant responsiveness"
    },
    {
        name: "Gemini 2.0 Flash",
        modelName: "gemini-2.0-flash-exp",
        provider: "google",
        maxTokens: 1048576,
        description: "Next generation features, speed, and multimodal generation for a diverse variety of tasks"
    },
    {
        name: "Gemini 1.5 Flash",
        modelName: "gemini-1.5-flash",
        provider: "google",
        maxTokens: 1048576,
        description: "Fast and versatile performance across a diverse variety of tasks"
    },
    {
        name: "Gemini 1.5 Flash 8B",
        modelName: "gemini-1.5-flash-8b",
        provider: "google",
        maxTokens: 1048576,
        description: "High volume and lower intelligence tasks"
    },
    {
        name: "Gemini 1.5 Pro",
        modelName: "gemini-1.5-pro",
        provider: "google",
        maxTokens: 2097152,
        description: "Complex reasoning tasks requiring more intelligence"
    },
    {
        name: "Grok 2",
        modelName: "grok-2-1212",
        provider: "xai",
        maxTokens: 131072,
        description: "Our latest text model supporting structured outputs, with improved efficiency, speed and capabilities."
    },
]