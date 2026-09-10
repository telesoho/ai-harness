/**
 * @mirror DSH: packages/core/src/usage.ts
 *
 * Token 用量统计。DSH 还包含 cache_creation_input_tokens 等字段，本镜像只保留三个核心值。
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** DeepSeek / Anthropic 等的"已缓存的输入 token"，可节省费用。DSH 用 cache_read_input_tokens。 */
  cacheReadTokens?: number;
}