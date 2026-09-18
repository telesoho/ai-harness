/** @mirror DSH: apps/cli/src/commands/run.ts */

import { runAgent } from '@ai-harness/agent';
import { loadFromEnv, mergeConfig } from '@ai-harness/config';
import { InMemoryMessageStore } from '@ai-harness/context';
import { DeepSeekClient } from '@ai-harness/llm-deepseek';
import { echoTool, InMemoryToolRegistry } from '@ai-harness/tools';

const SYSTEM_PROMPT =
  'You are a helpful assistant. When a tool can complete the request, call it. After a tool result, answer the user with that result.';

/**
 * One user prompt → agent loop (LLM + echo). Tool lines are printed as
 * `[tool call]` / `[tool result]`; assistant text is prefixed with `agent: `.
 */
export async function cmdRun(args: string[]): Promise<number> {
  const prompt = args.join(' ').trim();
  if (prompt.length === 0) {
    console.error('usage: aih run <msg>');
    return 2;
  }

  const config = mergeConfig(loadFromEnv());
  if (config.apiKey.length === 0) {
    console.error('missing DEEPSEEK_API_KEY');
    return 1;
  }

  const client = new DeepSeekClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });
  const tools = new InMemoryToolRegistry();
  tools.register(echoTool);
  const context = new InMemoryMessageStore();
  const pendingCalls = new Map<string, { name: string; input: string }>();
  let wroteAgentPrefix = false;

  for await (const event of runAgent({
    client,
    tools,
    context,
    task: prompt,
    model: config.model,
    systemPrompt: SYSTEM_PROMPT,
  })) {
    switch (event.type) {
      case 'message_start':
        pendingCalls.clear();
        break;
      case 'text_delta':
        if (!wroteAgentPrefix) {
          process.stdout.write('agent: ');
          wroteAgentPrefix = true;
        }
        process.stdout.write(event.delta);
        break;
      case 'tool_call_delta':
        accumulateCliToolCall(pendingCalls, event);
        break;
      case 'tool_executing': {
        if (wroteAgentPrefix) {
          process.stdout.write('\n');
          wroteAgentPrefix = false;
        }
        const call = pendingCalls.get(event.callId);
        console.log(`[tool call] ${event.name}(${formatToolArgs(call?.input ?? '')})`);
        break;
      }
      case 'tool_result':
        console.log(`[tool result] ${stringifyResult(event.result)}`);
        break;
      case 'error':
        console.error(event.error);
        return 1;
      default:
        break;
    }
  }

  if (wroteAgentPrefix) console.log();
  return 0;
}

function accumulateCliToolCall(
  pending: Map<string, { name: string; input: string }>,
  ev: { id: string; name?: string; argsDelta: string },
): void {
  let id = ev.id;
  if (id.length === 0) {
    const last = [...pending.keys()].at(-1);
    if (last === undefined) return;
    id = last;
  }
  const current = pending.get(id) ?? { name: ev.name ?? '', input: '' };
  if (ev.name !== undefined) current.name = ev.name;
  current.input += ev.argsDelta;
  pending.set(id, current);
}

/** Compact `echo({"text":"hi"})` → `"hi"` so the lesson output reads `echo("hi")`. */
function formatToolArgs(input: string): string {
  if (input.length === 0) return '';
  try {
    const parsed: unknown = JSON.parse(input);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) && 'text' in parsed) {
      return JSON.stringify((parsed as { text: unknown }).text);
    }
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify(input);
  }
}

function stringifyResult(result: unknown): string {
  return typeof result === 'string' ? result : JSON.stringify(result);
}
