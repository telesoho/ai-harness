/**
 * @mirror DSH: packages/llm/llm-deepseek/src/translate.ts
 *
 * SSE chunk → `LLMEvent` 翻译。DSH 的实现更复杂（含 reasoning_content 单独通道、
 * 多 chunk 合并、错误事件特殊处理）。本镜像只保留教学必需路径。
 */

import type { LLMEvent } from '@ai-harness/llm';
import type { StopReason } from '@ai-harness/core';
import type { WireChunk } from './types.js';

export function translateChunk(chunk: WireChunk): LLMEvent[] {
  const events: LLMEvent[] = [];
  for (const choice of chunk.choices) {
    const d = choice.delta;
    if (d.content && d.content.length > 0) {
      events.push({ type: 'text_delta', delta: d.content });
    }
    if (d.reasoning_content && d.reasoning_content.length > 0) {
      events.push({ type: 'thinking_delta', delta: d.reasoning_content });
    }
    if (d.tool_calls) {
      for (const tc of d.tool_calls) {
        events.push({
          type: 'tool_call_delta',
          id: tc.id ?? '',
          ...(tc.function?.name !== undefined ? { name: tc.function.name } : {}),
          argsDelta: tc.function?.arguments ?? '',
        });
      }
    }
    if (choice.finish_reason) {
      const stopReason: StopReason =
        choice.finish_reason === 'tool_calls'
          ? 'tool_use'
          : choice.finish_reason === 'length'
            ? 'max_tokens'
            : 'end_turn';
      events.push({ type: 'done', stopReason });
    }
  }
  if (chunk.usage) {
    events.push({
      type: 'usage',
      usage: {
        inputTokens: chunk.usage.prompt_tokens,
        outputTokens: chunk.usage.completion_tokens,
        ...(chunk.usage.cached_tokens !== undefined
          ? { cacheReadTokens: chunk.usage.cached_tokens }
          : {}),
      },
    });
  }
  return events;
}