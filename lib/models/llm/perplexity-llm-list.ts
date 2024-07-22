import { LLM } from "@/types"

const PERPLEXITY_PLATORM_LINK =
  "https://docs.perplexity.ai/docs/getting-started"

// Perplexity Models (UPDATED 2/25/24) -----------------------------
// Model Deprecation Notice
// Please note that on March 15, the pplx-70b-chat, pplx-70b-online, llama-2-70b-chat, and codellama-34b-instruct models will no longer be available through the Perplexity API.

// Mixtral 8x7B Instruct (UPDATED 1/31/24)
const MIXTRAL_8X7B_INSTRUCT: LLM = {
  modelId: "mixtral-8x7b-instruct",
  modelName: "Mixtral 8x7B Instruct",
  provider: "perplexity",
  hostedId: "mixtral-8x7b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// Mistral 7B Instruct (UPDATED 1/31/24)
const MISTRAL_7B_INSTRUCT: LLM = {
  modelId: "mistral-7b-instruct",
  modelName: "Mistral 7B Instruct",
  provider: "perplexity",
  hostedId: "mistral-7b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// CodeLlama 70B Instruct (UPDATED 1/31/24)
const llama-3-8b-instruct"": LLM = {
  modelId: "llama-3-70b-instruct"",
  modelName: "Llama 3 70B Instruct",
  provider: "perplexity",
  hostedId: "llama-3-70b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false

// CodeLlama 8B Instruct (UPDATED 1/31/24)
const llama-3-8b-instruct"": LLM = {
  modelId: "llama-3-8b-instruct"",
  modelName: "Llama 3 8B Instruct",
  provider: "perplexity",
  hostedId: "llama-3-8b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// Sonar Small Chat (UPDATED 7/25/24)
const llama-3-sonar-small-32k-chat: LLM = {
  modelId: "llama-3-sonar-small-32k-chat",
  modelName: "Sonar Small Chat",
  provider: "perplexity",
  hostedId: "llama-3-sonar-small-32k-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// Sonar Small Online (UPDATED 7/25/24)
const llama-3-sonar-small-32k-online: LLM = {
  modelId: "llama-3-sonar-small-32k-online",
  modelName: "Sonar Small Online",
  provider: "perplexity",
  hostedId: "llama-3-sonar-small-32k-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// llama-3-sonar-large-32k-chat (Updated 7/22/24)
const llama-3-sonar-large-32k-chat: LLM = {
  modelId: "llama-3-sonar-large-32k-chat",
  modelName: "Sonar Large Chat",
  provider: "perplexity",
  hostedId: "llama-3-sonar-large-32k-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// Sonar Large Online (UPDATED 7/25/24)
const llama-3-sonar-large-32k-online: LLM = {
  modelId: "llama-3-sonar-large-32k-chat-online",
  modelName: "Sonar Large Online",
  provider: "perplexity",
  hostedId: "llama-3-sonar-large-32k-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

export const PERPLEXITY_LLM_LIST: LLM[] = [
  MIXTRAL_8X7B_INSTRUCT,
  MISTRAL_7B_INSTRUCT,
  llama-3-70b-instruct
  llama-3-8b-instruct",
  llama-3-sonar-small-32k-chat,
  llama-3-sonar-small-32k-online,
  llama-3-sonar-large-32k-chat,
  llama-3-sonar-large-32k-online
]
