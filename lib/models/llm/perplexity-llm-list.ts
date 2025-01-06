import { LLM } from '@/types';

const PERPLEXITY_PLATORM_LINK =
  'https://docs.perplexity.ai/docs/getting-started';

// Perplexity Models (UPDATED 2/25/24) -----------------------------
// Model Deprecation Notice
// Please note that on March 15, the pplx-70b-chat, pplx-70b-online, llama-2-70b-chat, and codellama-34b-instruct models will no longer be available through the Perplexity API.

// Mixtral 8x7B Instruct (UPDATED 1/31/24)
const MIXTRAL_8X7B_INSTRUCT: LLM = {
  modelId: 'mixtral-8x7b-instruct',
  modelName: 'Mixtral 8x7B Instruct',
  provider: 'perplexity',
  hostedId: 'mixtral-8x7b-instruct',
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// Mistral 7B Instruct (UPDATED 1/31/24)
const MISTRAL_7B_INSTRUCT: LLM = {
  modelId: 'mistral-7b-instruct',
  modelName: 'Mistral 7B Instruct',
  provider: 'perplexity',
  hostedId: 'mistral-7b-instruct',
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// CodeLlama 70B Instruct (UPDATED 1/31/24)
const llama_3_70b_instruct: LLM = {
  modelId: "llama-3-70b-instruct",
  modelName: "Llama 3 70B Instruct",
  provider: "perplexity",
  hostedId: "llama-3-70b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

// CodeLlama 8B Instruct (UPDATED 1/31/24)
const llama_3_8b_instruct: LLM = {
  modelId: "llama-3-8b-instruct",
  modelName: "Llama 3 8B Instruct",
  provider: "perplexity",
  hostedId: "llama-3-8b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// Sonar Small Chat (UPDATED 7/25/24)
const llama_31_sonar_small_128k_chat: LLM = {
  modelId: "llama-3.1-sonar-small-128k-chat",
  modelName: "Sonar Small Chat",
  provider: "perplexity",
  hostedId: "llama-3.1-sonar-small-128k-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// Sonar Small Online (UPDATED 7/25/24)
const llama_31_sonar_small_128k_online: LLM = {
  modelId: "llama-3.1-sonar-small-128k-online",
  modelName: "Sonar Small Online",
  provider: "perplexity",
  hostedId: "llama-3.1-sonar-small-128k-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// llama-3-sonar-large-32k-chat (Updated 7/22/24)
const llama_31_sonar_large_128k_chat: LLM = {
  modelId: "llama-3.1-sonar-large-128k-chat",
  modelName: "Sonar Large Chat",
  provider: "perplexity",
  hostedId: "llama-3.1-sonar-large-128k-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

// Sonar Large Online (UPDATED 7/25/24)
const llama_31_sonar_large_128k_online: LLM = {
  modelId: "llama-3.1-sonar-large-128k-online",
  modelName: "Sonar Large Online",
  provider: "perplexity",
  hostedId: "llama-3.1-sonar-large-128k-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
};

export const PERPLEXITY_LLM_LIST: LLM[] = [
  MIXTRAL_8X7B_INSTRUCT,
  MISTRAL_7B_INSTRUCT,
  llama_3_70b_instruct,
  llama_3_8b_instruct,
  llama_31_sonar_small_128k_chat,
  llama_31_sonar_small_128k_online,
  llama_31_sonar_large_128k_chat,
  llama_31_sonar_large_128k_online
]
