/**
 * @mirror DSH: packages/llm/llm/src/event.ts
 *
 * Provider 流式事件。`LLMClient.complete()` 返回 `AsyncIterable<LLMEvent>`。
 *
 * 与 `AgentEvent` 的区别：
 * - `LLMEvent` 是 provider 中立的"原始流"
 * - `AgentEvent` 是 agent 主循环包装后的"业务流"（多了一层 tool_executing 等语义）
 */

import type { StopReason, TokenUsage, ToolDefinition } from '@ai-harness/core';

export type LLMEvent =
  | { type: 'message_start'; messageId: string; model: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'thinking_delta'; delta: string }
  | {
      type: 'tool_call_delta';
      id: string;
      name?: string;
      argsDelta: string;
    }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'done'; stopReason: StopReason }
  | { type: 'error'; error: Error };

/** Adapter 在流结束时吐出的"完整生成结果"。 */
export interface LLMStreamFinal {
  messageId: string;
  model: string;
  stopReason: StopReason;
  usage: TokenUsage;
  /** 用于鉴权与计费的 attribution 元数据。DSH 在 `attribution.ts` 定义。 */
  tools: ToolDefinition[];
}