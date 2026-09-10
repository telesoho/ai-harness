/**
 * @mirror DSH: packages/llm/llm/src/options.ts
 *
 * 跨 provider 的生成请求形状。DSH 的 `GenerateOptions` 字段更多（含 `metadata` /
 * `providerOptions` / `cacheControl` 等），本镜像只保留核心字段。
 */

import type { Message, ToolDefinition, StopReason, TokenUsage } from '@ai-harness/core';

export interface GenerateOptions {
  /** 模型 id。DSH 在 provider 层做 model 解析（catalog）。本镜像直接传字符串。 */
  model: string;
  /** 完整消息列表。DSH 由 `context` 包提供，本镜像直接传数组。 */
  messages: Message[];
  /** 可用工具。DSH 由 `tools` 注册表提供，本镜像直接传数组。 */
  tools?: ToolDefinition[];
  /** 0–1，越高越随机。 */
  temperature?: number;
  /** 生成上限（token）。 */
  maxTokens?: number;
  /** 停止序列。 */
  stop?: string[];
  /** 思考模式。DSH 把 `thinking.type` 透传到 wire 层。 */
  thinking?: { type: 'enabled' | 'disabled' };
  /** 思考预算（DeepSeek 的 `reasoning_effort`）。 */
  reasoningEffort?: 'low' | 'high' | 'max';
}

/** 单次生成的最终结果（非流式）。`LLMClient.complete()` 流式输出结束后由 adapter 合成。 */
export interface GenerateResult {
  /** 完整 assistant 消息。 */
  message: Message;
  stopReason: StopReason;
  usage: TokenUsage;
}