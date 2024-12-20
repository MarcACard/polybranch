import * as z from "zod";
import { LLMProviders } from "@/types/llm";

export const apiKeySchema = z.object({
  provider: z.enum(LLMProviders),
  name: z.string().optional(),
  apiKey: z.string().min(1, "API Key is required"),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
