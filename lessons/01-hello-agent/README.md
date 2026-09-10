# Lesson 01 — hello-agent

> **目标**：跑通"问一句、答一句"，无流式、无工具。

## 跑通命令（待实现）

```bash
pnpm aih run "你好"
```

期望输出：

```
[aih run] TODO: see lessons/01
```

## 本章解锁的镜像代码

`packages/llm-deepseek/src/adapter.ts` 的 `complete()` 函数体从 `throw` 变为真实 fetch + 一次性格式化。

## 本章涉及的 DSH 源

- [`packages/llm/llm-deepseek/src/adapter.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/adapter.ts) —— `DeepSeekClient.complete()`
- [`packages/llm/llm/src/options.ts`](https://example.com/dsh/packages/llm/llm/src/options.ts) —— `GenerateOptions`
- [`apps/cli/src/commands/run.ts`](https://example.com/dsh/apps/cli/src/commands/run.ts) —— CLI 入口

## 占位代码块（教学代码，下一章会填充）

```ts
// 当前位于 packages/llm-deepseek/src/adapter.ts
async *complete(req: GenerateOptions, signal?: AbortSignal): AsyncIterable<LLMEvent> {
  // TODO(lessons/01)
  // 1) 构造 WireRequest: toWireRequest(req)
  // 2) fetch(baseUrl + '/v1/chat/completions', { headers, body })
  // 3) 把 fetch 的 Response.body (ReadableStream) 转 SSE
  // 4) 每个 chunk → translateChunk → yield
}
```