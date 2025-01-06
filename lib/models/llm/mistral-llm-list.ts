import { LLM } from "@/types"

const MISTRAL_PLATORM_LINK = "https://docs.mistral.ai/"

// Mistral Models (UPDATED 12/21/23) -----------------------------

// Mistral 7B (UPDATED 12/21/23)
const MISTRAL_7B: LLM = {
  modelId: "mistral-tiny",
  modelName: "Mistral Tiny",
  provider: "mistral",
  hostedId: "mistral-tiny",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false
}

// Mixtral (UPDATED 12/21/23)
const MIXTRAL: LLM = {
  modelId: "mistral-small-latest",
  modelName: "Mistral Small",
  provider: "mistral",
  hostedId: "mistral-small-latest",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 2,
    outputCost: 6
  }
}

// Mistral Medium (UPDATED 12/21/23)
const MISTRAL_MEDIUM: LLM = {
  modelId: "mistral-medium-latest",
  modelName: "Mistral Medium",
  provider: "mistral",
  hostedId: "mistral-medium-latest",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 2.7,
    outputCost: 8.1
  }
}

// Mistral Large (UPDATED 03/05/24)
const MISTRAL_LARGE: LLM = {
  modelId: "mistral-large-latest",
  modelName: "Mistral Large",
  provider: "mistral",
  hostedId: "mistral-large-latest",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 8,
    outputCost: 24
  }
}

const OPEN_MISTRAL_NEMO: LLM = {
  modelId: "open-mistral-nemo",
  modelName: "Open Mistral Nemo",
  provider: "mistral",
  hostedId: "open-mistral-nemo",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

const CODESTRAL_MAMBA_2407: LLM = {
  modelId: "codestral-mamba-2407",
  modelName: "CodeStral Mamba 2407",
  provider: "mistral",
  hostedId: "codestral-mamba-2407",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 6,
    outputCost: 18
  }
}

const CODESTRAL_2405: LLM = {
  modelId: "codestral-2405",
  modelName: "CodeStral 2405",
  provider: "mistral",
  hostedId: "codestral-2405",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 7,
    outputCost: 21
  }
}

const MISTRAL_LARGE_2407: LLM = {
  modelId: "mistral-large-2407",
  modelName: "Mistral Large 2407",
  provider: "mistral",
  hostedId: "mistral-large-2407",
  platformLink: MISTRAL_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 9,
    outputCost: 27
  }
}

export const MISTRAL_LLM_LIST: LLM[] = [
  MISTRAL_7B,
  MIXTRAL,
  MISTRAL_MEDIUM,
  MISTRAL_LARGE,
  OPEN_MISTRAL_NEMO,
  CODESTRAL_MAMBA_2407,
  CODESTRAL_2405,
  MISTRAL_LARGE_2407
]