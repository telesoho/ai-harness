/**
 * @mirror DSH: packages/code-runtime/src/runtime.ts
 *
 * Agent 主循环。这是整个仓库最核心的一个函数。
 *
 * 真值在 DSH 的 `runtime.ts`。该函数大致结构（简化）：
 *
 * ```
 * while (!done) {
 *   stream = client.complete({ model, messages, tools });
 *   for await (event of stream) {
 *     yield mapToAgentEvent(event);     // LLMEvent → AgentEvent
 *     if (event.type === 'tool_call_delta' && isComplete) {
 *       result = await tools.invoke(name, args);
 *       context.append({ role: 'tool', content: [{ type: 'tool_result', ... }] });
 *     }
 *     if (event.type === 'done' && event.stopReason === 'end_turn') done = true;
 *   }
 * }
 * ```
 *
 * 本镜像刻意只暴露签名 + TODO。教学项目会先在 lessons/03 单文件实现，再回过头
 * 解释为什么 DSH 把它拆成 ~30 个小函数。
 */

import type { AgentEvent } from '@ai-harness/core';
import type { AgentRunOptions } from './options.js';

export function runAgent(opts: AgentRunOptions): AsyncIterable<AgentEvent> {
  // TODO: see lessons/03 — 实现 while-loop
  void opts;
  throw new Error('TODO: see lessons/03');
}