import { CoreLLMParameters } from "@/types/llm-parameters";

export const DEFAULT_PARAMETERS: CoreLLMParameters = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1
};

export const PARAMETERS_DISPLAY = {
  temperature: {
    display:"Temperature",
    description: "Adjusts the creativity of responses. Higher values (e.g., 1.0) yield more varied output, while lower values (e.g., 0.2) make responses more focused and deterministic."
  },
  maxTokens: {
    display: "Max Tokens",
    description: "Limits the length of the response. Higher values allow for longer outputs but may use more resources. Lower values help keep responses brief and focused."
  },
  topP: {
    display: "Top P",
    description: "Controls diversity via nucleus sampling. Lower values restrict responses to higher-probability options, while higher values allow for broader variations."
  }
}

export const PARAMETER_LIMITS = {
  temperature: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  maxTokens: {
    min: 1,
    max: 4096,
    step: 1,
  },
  topP: {
    min: 0,
    max: 1,
    step: .01
  }
};