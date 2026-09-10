# Lesson 03 — tools-and-loop

> **目标**：让模型能调用工具（先实现一个 `echo`），并把结果回灌到下一轮 LLM 请求；直到 `end_turn`。

## 跑通命令（待实现）

```bash
pnpm aih run "把 'hi' 调用 echo 工具并返回结果"
```

期望输出：

```
[tool call] echo("hi")
[tool result] hi
agent: hi
```

## 本章解锁的镜像代码

- `packages/tools/src/registry.ts` —— `invoke()` 真实执行
- `packages/tools/src/builtin/echo.ts` —— 第一个真实工具（DSH 没有同名工具；本镜像自加）
- `packages/agent/src/agent.ts` —— `runAgent` 解锁 while-loop

## 本章涉及的 DSH 源

- [`packages/code-runtime/src/runtime.ts`](https://example.com/dsh/packages/code-runtime/src/runtime.ts) —— 主循环真值
- [`packages/core/src/tools/registry.ts`](https://example.com/dsh/packages/core/src/tools/registry.ts) —— 工具注册
- [`packages/core/src/event.ts`](https://example.com/dsh/packages/core/src/event.ts) —— `tool_executing` / `tool_result` 事件

## 占位代码块

```ts
// 当前位于 packages/agent/src/agent.ts
export function runAgent(opts: AgentRunOptions): AsyncIterable<AgentEvent> {
  return (async function* () {
    let turn = 0;
    while (turn++ < 50) {
      const messages = opts.context.list();
      const stream = opts.client.complete({
        model: opts.model,
        messages,
        tools: opts.tools.list(),
      });

      let pendingCalls: ToolUseBlock[] = [];
      let textBuf = '';

      for await (const ev of stream) {
        if (ev.type === 'text_delta') { textBuf += ev.delta; yield ev; continue; }
        if (ev.type === 'tool_call_delta') {
          // ...accumulate and invoke when JSON parseable
        }
        if (ev.type === 'done') {
          if (ev.stopReason === 'end_turn') return;
          if (ev.stopReason === 'tool_use') {
            for (const call of pendingCalls) {
              yield { type: 'tool_executing', callId: call.id, name: call.name };
              const result = await opts.tools.invoke(call.name, JSON.parse(call.input), { cwd: '', signal: opts.signal ?? new AbortController().signal });
              opts.context.append({ role: 'tool', content: [{ type: 'tool_result', toolCallId: call.id, content: result.content, isError: result.isError }] });
              yield { type: 'tool_result', callId: call.id, result: result.content, isError: result.isError };
            }
            break; // 进入下一轮 while
          }
        }
      }
    }
  })();
}
```