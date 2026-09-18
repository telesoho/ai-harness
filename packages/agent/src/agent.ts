/**
 * @mirror DSH: packages/code-runtime/src/runtime.ts
 *
 * Agent 主循环。这是整个仓库最核心的一个函数。
 *
 * 镜像只做：stream → 累加 tool_call_delta → invoke → 把 tool_result 写回
 * context → 再请求，直到 `end_turn`。DSH 的 `agent-loop` 还包含 hook、权限、
 * 并行调度、超时与 session 日志；读那边才能看到真实复杂度。
 */

import { AgentError } from '@ai-harness/core';
import type {
  AgentEvent,
  ContentBlock,
  Message,
  StopReason,
  TokenUsage,
  ToolResult,
  ToolUseBlock,
} from '@ai-harness/core';
import type { LLMEvent } from '@ai-harness/llm';
import type { AgentRunOptions } from './options.js';

const MAX_TURNS = 50;
const EMPTY_USAGE: TokenUsage = { inputTokens: 0, outputTokens: 0 };

function parseToolInput(input: string): unknown {
  if (input.length === 0) return {};
  try {
    return JSON.parse(input) as unknown;
  } catch {
    return input;
  }
}

/** OpenAI-style deltas: first chunk has `id`/`name`, later chunks often omit `id`. */
function accumulateToolCall(
  pending: ToolUseBlock[],
  ev: Extract<LLMEvent, { type: 'tool_call_delta' }>,
): void {
  let target: ToolUseBlock | undefined;
  if (ev.id.length > 0) {
    target = pending.find((call) => call.id === ev.id);
  } else {
    target = pending.at(-1);
  }
  if (target === undefined) {
    pending.push({
      type: 'tool_use',
      id: ev.id,
      name: ev.name ?? '',
      input: ev.argsDelta,
    });
    return;
  }
  if (ev.name !== undefined) target.name = ev.name;
  target.input += ev.argsDelta;
}

function assistantMessage(text: string, thinking: string, calls: ToolUseBlock[]): Message {
  const content: ContentBlock[] = [];
  if (thinking.length > 0) content.push({ type: 'thinking', text: thinking });
  if (text.length > 0) content.push({ type: 'text', text });
  content.push(...calls);
  return { role: 'assistant', content };
}

function addUsage(into: TokenUsage, add: TokenUsage): TokenUsage {
  return {
    inputTokens: into.inputTokens + add.inputTokens,
    outputTokens: into.outputTokens + add.outputTokens,
    ...(add.cacheReadTokens !== undefined || into.cacheReadTokens !== undefined
      ? { cacheReadTokens: (into.cacheReadTokens ?? 0) + (add.cacheReadTokens ?? 0) }
      : {}),
  };
}

function seedContext(opts: AgentRunOptions): void {
  if (opts.systemPrompt !== undefined && opts.systemPrompt.length > 0) {
    const hasSystem = opts.context.list().some((m) => m.role === 'system');
    if (!hasSystem) {
      opts.context.append({
        role: 'system',
        content: [{ type: 'text', text: opts.systemPrompt }],
      });
    }
  }
  opts.context.append({
    role: 'user',
    content: [{ type: 'text', text: opts.task }],
  });
}

export function runAgent(opts: AgentRunOptions): AsyncIterable<AgentEvent> {
  return loop(opts);
}

async function* loop(opts: AgentRunOptions): AsyncGenerator<AgentEvent> {
  const signal = opts.signal ?? new AbortController().signal;
  seedContext(opts);

  let totalUsage: TokenUsage = { ...EMPTY_USAGE };
  let turn = 0;

  while (turn++ < MAX_TURNS) {
    if (signal.aborted) {
      yield { type: 'error', error: new AgentError('aborted', 'agent run aborted') };
      return;
    }

    yield { type: 'message_start', messageId: `turn-${turn}`, model: opts.model };

    const stream = opts.client.complete(
      {
        model: opts.model,
        messages: opts.context.list(),
        tools: opts.tools.list(),
      },
      signal,
    );

    const pendingCalls: ToolUseBlock[] = [];
    let textBuf = '';
    let thinkingBuf = '';
    let stopReason: StopReason | undefined;

    for await (const ev of stream) {
      switch (ev.type) {
        case 'message_start':
          yield ev;
          break;
        case 'text_delta':
          textBuf += ev.delta;
          yield ev;
          break;
        case 'thinking_delta':
          thinkingBuf += ev.delta;
          yield ev;
          break;
        case 'tool_call_delta':
          accumulateToolCall(pendingCalls, ev);
          yield ev;
          break;
        case 'usage':
          totalUsage = addUsage(totalUsage, ev.usage);
          break;
        case 'done':
          stopReason = ev.stopReason;
          break;
        case 'error':
          yield ev;
          return;
        default: {
          const _never: never = ev;
          void _never;
        }
      }
    }

    if (stopReason === undefined) {
      yield {
        type: 'error',
        error: new AgentError('incomplete', 'model stream ended without a stop reason'),
      };
      return;
    }

    if (stopReason === 'tool_use' && pendingCalls.length > 0) {
      opts.context.append(assistantMessage(textBuf, thinkingBuf, pendingCalls));
      for (const call of pendingCalls) {
        yield { type: 'tool_executing', callId: call.id, name: call.name };
        let result: ToolResult;
        try {
          result = await opts.tools.invoke(call.name, parseToolInput(call.input), {
            cwd: process.cwd(),
            signal,
          });
        } catch (error: unknown) {
          result = {
            content: error instanceof Error ? error.message : String(error),
            isError: true,
          };
        }
        opts.context.append({
          role: 'tool',
          content: [
            {
              type: 'tool_result',
              toolCallId: call.id,
              content: result.content,
              isError: result.isError,
            },
          ],
        });
        yield {
          type: 'tool_result',
          callId: call.id,
          result: result.content,
          isError: result.isError,
        };
      }
      continue;
    }

    opts.context.append(assistantMessage(textBuf, thinkingBuf, pendingCalls));
    yield { type: 'done', stopReason, usage: totalUsage };
    return;
  }

  yield { type: 'error', error: new AgentError('max_turns', `exceeded ${MAX_TURNS} turns`) };
}
