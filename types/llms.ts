import { ModelProvider } from '.';

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | GroqLLMID
  | PerplexityLLMID
  | CustomLLMID;

// OpenAI Models (UPDATED 5/13/24)
export type OpenAILLMID =
  | 'gpt-4o' // GPT-4o
  | 'gpt-4-turbo-preview' // GPT-4 Turbo
  | 'gpt-4-vision-preview' // GPT-4 Vision
  | 'gpt-4' // GPT-4
  | 'gpt-3.5-turbo'; // Updated GPT-3.5 Turbo

// Google Models
export type GoogleLLMID =
  | 'gemini-pro' // Gemini Pro
  | 'gemini-pro-vision' // Gemini Pro Vision
  | 'gemini-1.5-pro-latest' // Gemini 1.5 Pro
  | 'gemini-1.5-flash'; // Gemini 1.5 Flash

// Anthropic Models
export type AnthropicLLMID =
  //| "claude-3-sonnet-20240229"// claude 3
  | "claude-2.1" // Claude 2
  | "claude-instant-1.2" // Claude Instant
  | "claude-3-haiku-20240307" // Claude 3 Haiku
  | "claude-3-sonnet-20240229" // Claude 3 Sonnet
  | "claude-3-opus-20240229" // Claude 3 Opus
  | "claude-3-5-sonnet-20240620" // Claude 3.5 Sonnet

// Mistral Models
export type MistralLLMID =
  | "mistral-tiny" // Mistral Tiny
  | "mistral-small-latest" // Mistral Small
  | "mistral-medium-latest" // Mistral Medium
  | "mistral-large-latest" // Mistral Large
  | "codestral-mamba-2407" // CodeStral Mamba 2407
  | "codestral-2405" // CodeStral 2405
  | "mistral-large-2407" // Mistral Large 2407

export type GroqLLMID =
  | "llama3-8b-8192" // LLaMA3-8b
  | "llama3-70b-8192" // LLaMA3-70b
  | "mixtral-8x7b-32768" // Mixtral-8x7b
  | "gemma-7b-it" // Gemma-7b IT
  | "llama-3.1-405b-reasoning" // LLaMA31-405b
  | "llama-3.1-70b-versatile" // LLaMA31-405b Instruct
  | "llama-3.1-8b-instant" // LLaMA31-405b Chat
  | "llama3-groq-70b-8192-tool-use-preview" // LLaMA3 Groq 70B Tool Use
  | "llama3-groq-8b-8192-tool-use-preview" // LLaMA3 Groq 70B Translation

// Perplexity Models (UPDATED 1/31/24)
export type PerplexityLLMID =
  | 'pplx-7b-online' // Perplexity Online 7B
  | 'pplx-70b-online' // Perplexity Online 70B
  | 'pplx-7b-chat' // Perplexity Chat 7B
  | 'pplx-70b-chat' // Perplexity Chat 70B
  | 'mixtral-8x7b-instruct' // Mixtral 8x7B Instruct
  | 'mistral-7b-instruct' // Mistral 7B Instruct
  | 'llama-3-70b-instruct' // Llama3 70B Chat
  | 'llama-3-8b-instruct' // Llama 3 8B Instruct
  | 'codellama-70b-instruct' // CodeLlama 70B Instruct
  | 'llama-3.1-sonar-small-128k-chat' // Sonar Small Chat
  | 'llama-3.1-sonar-small-128k-online' // Sonar Small Online
  | 'llama-3.1-sonar-large-128k-chat' // Sonar Large Chat
  | 'sonar'
  | 'sonar-pro'
  | 'sonar-pro-reasoning'
  | 'llama-3.1-sonar-large-128k-online'; // Sonar Large Online

export type CustomLLMID =
  | 'FineTuning_LLM'
  | 'jailbreaking-model-1'
  | 'jailbreaking-model-2'
  | 'jailbreaking-model-3'
  | 'jailbreaking-model-4'
  | 'jailbreaking-model-5'
  | 'jailbreaking-model-6'
  | 'jailbreaking-model-7'
  | 'jailbreaking-model-8'
  | 'jailbreaking-model-9'
  | 'jailbreaking-model-10';

export interface LLM {
  modelId: LLMID;
  modelName: string;
  provider: ModelProvider;
  hostedId: string;
  platformLink: string;
  imageInput: boolean;
  pricing?: {
    currency: string;
    unit: string;
    inputCost: number;
    outputCost?: number;
  };
}

export interface OpenRouterLLM extends LLM {
  maxContext: number;
}
