/**
 * @mirror DSH: packages/core/src/event.ts
 *
 * Agent 事件流。这是仓库里**最核心的判别联合**：
 *
 * - 上游 LLM provider 把 wire 事件翻译成 `LLMEvent`
 * - agent 主循环把 `LLMEvent` 进一步包装为 `AgentEvent`（见 `agent.ts`）
 * - UI / CLI / Web 全部订阅 `AgentEvent` 流
 *
 * ⚠️ 改这个类型 = 改所有下游包的形状。慎之又慎。
 */

import type { StopReason } from './stop.js';
import type { TokenUsage } from './usage.js';
export type { TokenUsage } from './usage.js';

/** Agent 事件判别联合。 */
export type AgentEvent =
  | { type: 'message_start'; messageId: string; model: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'thinking_delta'; delta: string }
  | {
      type: 'tool_call_delta';
      id: string;
      name?: string;
      /** 增量 JSON 字符串；累计到合法 JSON 时即可解析。 */
      argsDelta: string;
    }
  | { type: 'tool_executing'; callId: string; name: string }
  | {
      type: 'tool_result';
      callId: string;
      result: unknown;
      isError: boolean;
    }
  | { type: 'done'; stopReason: StopReason; usage: TokenUsage }
  | { type: 'error'; error: Error };