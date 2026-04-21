export const LLM_PROVIDER = {
  GEMINI: 'GEMINI',
  GPT: 'GPT',
  CLAUDE: 'CLAUDE',
} as const;

export type LlmProvider = (typeof LLM_PROVIDER)[keyof typeof LLM_PROVIDER];
