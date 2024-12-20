export const LLMProviders = ["openai", "anthropic", "google", "xai", "custom"] as const
export type LLMProvider = typeof LLMProviders[number]

export interface ApiKeyConfig {
    id: string
    name: string
    key: string
    provider: LLMProvider
    createdAt: number
}

export interface ModelConfig {
    id: string
    name: string
    modelName: string
    provider: LLMProvider
    apiKeyId: string
    endpoint?: string
    isHosted: boolean
    namespace?: string
    createdAt: number
}

export interface HostedModel {
    name: string
    modelName: string
    provider: LLMProvider
    maxTokens?: number
    description?: string
}