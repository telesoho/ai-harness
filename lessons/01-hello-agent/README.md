# Lesson 01 — hello-agent

> **目标**：跑通"问一句、答一句"，无流式打印、无工具。

## 跑通命令

```bash
pnpm aih run "你好"
```

需要环境变量 `DEEPSEEK_API_KEY`（可选 `DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`）。期望输出是模型的**完整回复一次性打印**，例如：

```
你好！有什么我可以帮助你的吗？
```

（具体措辞随模型而变；不应再出现 `[aih run] TODO`。）

## 本章解锁的镜像代码

- `packages/llm-deepseek/src/adapter.ts` —— `complete()`：`fetch` + 行缓冲 SSE + `translateChunk`
- `apps/cli/src/commands/run.ts` —— 跳过 `runAgent`，直接调 `DeepSeekClient`，拼齐 `text_delta` 后打印

## 本章涉及的 DSH 源

- [`packages/llm/llm-deepseek/src/adapter.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/adapter.ts) —— `DeepSeekClient.complete()`
- [`packages/llm/llm/src/options.ts`](https://example.com/dsh/packages/llm/llm/src/options.ts) —— `GenerateOptions`
- [`apps/cli/src/commands/run.ts`](https://example.com/dsh/apps/cli/src/commands/run.ts) —— CLI 入口

## 实现对照

```ts
// packages/llm-deepseek/src/adapter.ts
async *complete(req: GenerateOptions, signal?: AbortSignal): AsyncIterable<LLMEvent> {
  const response = await fetch(baseUrl + '/v1/chat/completions', { headers, body: JSON.stringify(toWireRequest(req)), signal });
  // 行缓冲读 SSE：data: <json> … data: [DONE]
  // 每个 chunk → translateChunk → yield
}

// apps/cli/src/commands/run.ts
let text = '';
for await (const event of client.complete({ model, messages })) {
  if (event.type === 'text_delta') text += event.delta;
}
console.log(text); // lesson 02 改为逐 token write
```
