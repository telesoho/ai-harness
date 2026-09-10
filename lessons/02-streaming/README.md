# Lesson 02 — streaming

> **目标**：把"一次性完整响应"改为"逐 token 流式"，并在终端逐字打印。

## 跑通命令（待实现）

```bash
pnpm aih run "写一首五言绝句"
```

期望输出：

```
床 前 明 月 光，
疑 是 地 上 霜。
举 头 望 明 月，
低 头 思 故 乡。
```

## 本章解锁的镜像代码

- `packages/llm-deepseek/src/translate.ts` —— `translateChunk()` 实际起作用
- `apps/cli/src/commands/run.ts` —— 改写为 `for await` 消费事件

## 本章涉及的 DSH 源

- [`packages/llm/llm-deepseek/src/sse.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/sse.ts) —— SSE 解析
- [`packages/llm/llm-deepseek/src/translate.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/translate.ts) —— chunk → event
- [`packages/core/src/event.ts`](https://example.com/dsh/packages/core/src/event.ts) —— `AgentEvent` 判别联合

## 占位代码块

```ts
// 当前位于 packages/llm-deepseek/src/translate.ts
// 已经写好。本章关键是把它接到 fetch 的 SSE 上：
const body = response.body!;
const reader = body.getReader();
const decoder = new TextDecoder();
let buffer = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  for (const line of buffer.split('\n')) {
    if (!line.startsWith('data:')) continue;
    const json = line.slice(5).trim();
    if (json === '[DONE]') return;
    const chunk: WireChunk = JSON.parse(json);
    for (const ev of translateChunk(chunk)) yield ev;
  }
}
```