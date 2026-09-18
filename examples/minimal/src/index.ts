/**
 * @mirror DSH: packages/code-runtime/src/example.ts（伪）
 *
 * 这个示例展示"完整跑通一次 agent"的代码形状。代码里的注释解释了每一行
 * 对应 DSH 的哪一部分。
 *
 * lesson 03 起 `runAgent` 会真正循环；init/repl 与 6 个 FS/shell 工具仍是 TODO。
 */

import { runAgent } from '@ai-harness/agent';
import { DeepSeekClient } from '@ai-harness/llm-deepseek';
import { echoTool, InMemoryToolRegistry } from '@ai-harness/tools';
import { InMemoryMessageStore } from '@ai-harness/context';
import { mergeConfig, loadFromEnv } from '@ai-harness/config';

async function main(): Promise<void> {
  // 1) 加载配置：env > 默认。DSH 在 `packages/settings` 里做这件事。
  const config = mergeConfig(loadFromEnv());

  // 2) 构造 provider：DSH 在 `apps/cli/src/commands/run.ts` 类似位置。
  const client = new DeepSeekClient({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
  });

  // 3) 准备工具表。lesson 03 解锁 echo；lesson 07 再加入 6 个内置工具。
  const tools = new InMemoryToolRegistry();
  tools.register(echoTool);

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
      case 'message_start':
        console.log(`[message_start] ${event.model} ${event.messageId}`);
        break;
      case 'text_delta':
        process.stdout.write(event.delta);
        break;
      case 'thinking_delta':
        process.stderr.write(event.delta);
        break;
      case 'tool_call_delta':
        process.stdout.write(
          `[tool_call_delta] ${event.id}${event.name !== undefined ? ` ${event.name}` : ''} ${event.argsDelta}`,
        );
        break;
      case 'tool_executing':
        console.log(`\n[tool_executing] ${event.name} ${event.callId}`);
        break;
      case 'tool_result':
        console.log(`[tool_result] ${event.callId}${event.isError ? ' error' : ''}`, event.result);
        break;
      case 'done':
        console.log('\n[done]', event.stopReason, event.usage);
        break;
      case 'error':
        console.error('\n[error]', event.error);
        break;
      default: {
        const _never: never = event;
        void _never;
      }
    }
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});