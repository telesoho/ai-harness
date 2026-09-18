# Lesson 03 — tools-and-loop

> **目标**：让模型能调用工具（先实现一个 `echo`），并把结果回灌到下一轮 LLM 请求；直到 `end_turn`。

## 跑通命令

```bash
pnpm aih run "把 'hi' 调用 echo 工具并返回结果"
```

需要环境变量 `DEEPSEEK_API_KEY`（可选 `DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`）。期望输出：

```
[tool call] echo("hi")
[tool result] hi
agent: hi
```

（模型可能先说一两句再调工具；`[tool call]` / `[tool result]` / 最终 `agent:` 这三行应出现。）

## 本章解锁的镜像代码

- `packages/tools/src/registry.ts` —— `invoke()` 真实执行
- `packages/tools/src/builtin/echo.ts` —— 第一个真实工具（DSH 没有同名工具；本镜像自加）
- `packages/agent/src/agent.ts` —— `runAgent` 解锁 while-loop
- `apps/cli/src/commands/run.ts` —— 走 `runAgent`，打印 tool / agent 行

## 本章涉及的 DSH 源

- [`packages/core/agent-loop/src/agent.ts`](https://example.com/dsh/packages/core/agent-loop/src/agent.ts) —— 主循环真值
- [`packages/core/src/tools/registry.ts`](https://example.com/dsh/packages/core/src/tools/registry.ts) —— 工具注册
- [`packages/core/src/event.ts`](https://example.com/dsh/packages/core/src/event.ts) —— `tool_executing` / `tool_result` 事件

## 实现对照

```ts
// packages/agent/src/agent.ts
while (turn++ < 50) {
  const stream = opts.client.complete({ model, messages: opts.context.list(), tools: opts.tools.list() });
  // 累加 text / thinking / tool_call_delta
  // stopReason === 'tool_use':
  //   context.append(assistant + tool_use)
  //   invoke → context.append(tool_result) → 下一轮
  // stopReason === 'end_turn': yield done and return
}

// packages/tools/src/builtin/echo.ts
async execute(args) { return { content: args.text, isError: false }; }

// apps/cli/src/commands/run.ts
for await (const event of runAgent({ client, tools, context, task, model })) {
  if (event.type === 'tool_executing') console.log(`[tool call] echo("…")`);
  if (event.type === 'tool_result') console.log(`[tool result] …`);
  if (event.type === 'text_delta') process.stdout.write(event.delta);
}
```
