import { LLM } from "@/types"

const ANTHROPIC_PLATORM_LINK =
  "https://docs.anthropic.com/claude/reference/getting-started-with-the-api"

// Anthropic Models (UPDATED 12/21/23) -----------------------------
// Claude 3 (UPDATED 12/21/23)
const CLAUDE_3: LLM = {
  modelId: "claude-3-sonnet-20240229",
  modelName: "Claude 3",
  provider: "anthropic",
  hostedId: "claude-3",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}
// Claude 2 (UPDATED 12/21/23)
const CLAUDE_2: LLM = {
  modelId: "claude-2.1",
  modelName: "Claude 2",
  provider: "anthropic",
  hostedId: "claude-2.1",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

// Claude Instant (UPDATED 12/21/23)
const CLAUDE_INSTANT: LLM = {
  modelId: "claude-instant-1.2",
  modelName: "Claude Instant",
  provider: "anthropic",
  hostedId: "claude-instant-1.2",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

export const ANTHROPIC_LLM_LIST: LLM[] = [CLAUDE_2, CLAUDE_INSTANT]
