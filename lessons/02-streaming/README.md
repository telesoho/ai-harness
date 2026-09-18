# Lesson 02 — streaming

> **目标**：把"一次性完整响应"改为"逐 token 流式"，并在终端逐字打印。

## 跑通命令

```bash
pnpm aih run "写一首五言绝句"
```

需要环境变量 `DEEPSEEK_API_KEY`（可选 `DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`）。每个 `text_delta` 立刻写出，所以字会一个接一个出现，而不是等整首诗拼齐。措辞随模型而变，例如：

```
床 前 明 月 光，
疑 是 地 上 霜。
举 头 望 明 月，
低 头 思 故 乡。
```

`aih run` 只把 `text_delta` 打到 stdout；`thinking_delta` / `usage` / `done` 等其它流式事件在 `examples/minimal` 里按类型打印。

## 本章解锁的镜像代码

- `packages/llm-deepseek/src/translate.ts` —— `translateChunk()` 把 SSE JSON 译成 `text_delta` / `thinking_delta` / `tool_call_delta` / `done` / `usage`
- `packages/llm-deepseek/src/adapter.ts` —— 行缓冲读 `data:` 行，每行交给 `translateChunk` 再 `yield`
- `apps/cli/src/commands/run.ts` —— 每个 `text_delta` 立刻 `process.stdout.write`
- `examples/minimal/src/index.ts` —— 按 `AgentEvent` 类型逐条打印

## 本章涉及的 DSH 源

- [`packages/llm/llm-deepseek/src/sse.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/sse.ts) —— SSE 解析
- [`packages/llm/llm-deepseek/src/translate.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/translate.ts) —— chunk → event
- [`packages/core/src/event.ts`](https://example.com/dsh/packages/core/src/event.ts) —— `AgentEvent` 判别联合

## 实现对照

```ts
// packages/llm-deepseek/src/adapter.ts
for await (const payload of readSseData(response.body)) {
  if (payload === SSE_DONE) return;
  const chunk = JSON.parse(payload) as WireChunk;
  for (const event of translateChunk(chunk)) yield event;
}

// packages/llm-deepseek/src/translate.ts
if (d.content) events.push({ type: 'text_delta', delta: d.content });
if (d.reasoning_content) events.push({ type: 'thinking_delta', delta: d.reasoning_content });

// apps/cli/src/commands/run.ts
for await (const event of client.complete({ model, messages })) {
  if (event.type === 'text_delta') process.stdout.write(event.delta);
}
console.log();
```
