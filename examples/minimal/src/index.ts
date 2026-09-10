/**
 * @mirror DSH: packages/code-runtime/src/example.ts（伪）
 *
 * 这个示例展示"完整跑通一次 agent"的代码形状。代码里的注释解释了每一行
 * 对应 DSH 的哪一部分。
 *
 * 当前所有 `await` 的实际行为都是抛 TODO。请按 lessons/01 → 04 顺序解锁。
 */

import { runAgent } from '@ai-harness/agent';
import { DeepSeekClient } from '@ai-harness/llm-deepseek';
import { InMemoryToolRegistry } from '@ai-harness/tools';
import { InMemoryMessageStore } from '@ai-harness/context';
import { mergeConfig, loadFromEnv } from '@ai-harness/config';
import type { AgentEvent } from '@ai-harness/core';

async function main(): Promise<void> {
  // 1) 加载配置：env > 默认。DSH 在 `packages/settings` 里做这件事。
  const config = mergeConfig(loadFromEnv());

  // 2) 构造 provider：DSH 在 `apps/cli/src/commands/run.ts` 类似位置。
  const client = new DeepSeekClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });

  // 3) 准备工具表（当前为空；lesson 07 会加入 6 个内置工具）。
  const tools = new InMemoryToolRegistry();

  // 4) 准备消息存储。
  const context = new InMemoryMessageStore();

  // 5) 启动 agent 循环：DSH 在 `packages/code-runtime/src/runtime.ts`。
  const stream = runAgent({
    client,
    tools,
    context,
    task: 'What is an LLM tool call?',
    model: config.model,
  });

  // 6) 消费事件流。DSH 的 CLI / Web / Desktop 各自有不同的渲染层。
  for await (const event of stream) {
    switch (event.type) {
      case 'text_delta':
        process.stdout.write(event.delta);
        break;
      case 'done':
        console.log('\n[done]', event.stopReason, event.usage);
        break;
      case 'error':
        console.error('\n[error]', event.error);
        break;
      default:
        // 其他事件当前不打印。lesson 02 会加入完整事件日志。
        const _e: AgentEvent = event;
        void _e;
    }
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});