/**
 * @mirror DSH: packages/llm/llm-deepseek/src/serialize.ts
 *
 * `GenerateOptions` → `WireRequest` 的翻译函数。DSH 的实现在多处复用。
 */

import type { GenerateOptions } from '@ai-harness/llm';
import type {
  WireMessage,
  WireRequest,
  WireSystemMessage,
  WireTool,
  WireUserMessage,
  WireAssistantMessage,
  WireToolMessage,
} from './types.js';

export function toWireRequest(opts: GenerateOptions): WireRequest {
  const messages: WireMessage[] = opts.messages.map((m): WireMessage => {
    if (m.role === 'system') {
      const out: WireSystemMessage = {
        role: 'system',
        content: m.content
          .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
          .map((b) => b.text)
          .join(''),
      };
      return out;
    }
    if (m.role === 'user') {
      const text = m.content
        .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
        .map((b) => b.text)
        .join('');
      const out: WireUserMessage = { role: 'user', content: text };
      return out;
    }
    if (m.role === 'assistant') {
      const text = m.content
        .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
        .map((b) => b.text)
        .join('');
      const toolCalls = m.content
        .filter((b): b is { type: 'tool_use'; id: string; name: string; input: string } => b.type === 'tool_use')
        .map((b) => ({ id: b.id, type: 'function' as const, function: { name: b.name, arguments: b.input } }));
      const out: WireAssistantMessage = {
        role: 'assistant',
        content: text || null,
        ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
      };
      return out;
    }
    // tool
    const result = m.content.find((b): b is { type: 'tool_result'; toolCallId: string; content: string; isError: boolean } => b.type === 'tool_result');
    if (!result) {
      const out: WireAssistantMessage = { role: 'assistant', content: '' };
      return out;
    }
    const out: WireToolMessage = {
      role: 'tool',
      tool_call_id: result.toolCallId,
      content: result.content,
    };
    return out;
  });

  const tools: WireTool[] =
    opts.tools === undefined
      ? []
      : opts.tools.map((t) => ({
          type: 'function' as const,
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        }));

  const base: WireRequest = {
    model: opts.model,
    messages,
    stream: true,
    stream_options: { include_usage: true },
    ...(opts.tools !== undefined && tools.length > 0 ? { tools } : {}),
    ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
    ...(opts.maxTokens !== undefined ? { max_tokens: opts.maxTokens } : {}),
    ...(opts.stop ? { stop: opts.stop } : {}),
    ...(opts.thinking ? { thinking: opts.thinking } : {}),
    ...(opts.reasoningEffort ? { reasoning_effort: opts.reasoningEffort } : {}),
  };
  return base;
}