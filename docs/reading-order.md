# Reading Order — 5 步读懂 DSH 核心

> 推荐给"会 TS、不懂 agent"的读者。每步都给出**先看镜像**再看 **DSH** 的顺序。

## 第 1 步：进程怎么起来（5 分钟）

**镜像**：[`apps/cli/src/main.ts`](../apps/cli/src/main.ts)
**DSH**：[`apps/cli/src/main.ts`](https://example.com/dsh/apps/cli/src/main.ts)

看什么：
- 进程入口如何解析命令行
- 第一个命令是哪个、如何分派
- 错误如何冒泡

## 第 2 步：agent 循环的真相（10 分钟）

**镜像**：[`packages/agent/src/agent.ts`](../packages/agent/src/agent.ts)
**DSH**：[`packages/code-runtime/src/runtime.ts`](https://example.com/dsh/packages/code-runtime/src/runtime.ts)

看什么：
- `while (!done)` 是怎么写的
- 流式事件如何被消费
- 工具结果如何回灌到下一轮 LLM 请求

## 第 3 步：LLM 客户端抽象（10 分钟）

**镜像**：[`packages/llm/src/client.ts`](../packages/llm/src/client.ts)
**DSH**：[`packages/llm/llm/src/client.ts`](https://example.com/dsh/packages/llm/llm/src/client.ts)

看什么：
- `LLMClient.complete()` 接口形状
- `GenerateRequest` 与 `LLMEvent` 的判别联合
- 为什么用 `AsyncIterable` 而不是 `Promise<...>`

## 第 4 步：DeepSeek 如何适配（10 分钟）

**镜像**：[`packages/llm-deepseek/src/adapter.ts`](../packages/llm-deepseek/src/adapter.ts)
**DSH**：[`packages/llm/llm-deepseek/src/adapter.ts`](https://example.com/dsh/packages/llm/llm-deepseek/src/adapter.ts)

看什么：
- `WireRequest` ↔ `GenerateRequest` 的翻译函数
- SSE 流如何解析成 `LLMEvent`
- thinking mode（`reasoning_content`）如何单独提取

## 第 5 步：事件如何流（5 分钟）

**镜像**：[`packages/core/src/events.ts`](../packages/core/src/events.ts)
**DSH**：[`packages/core/src/event.ts`](https://example.com/dsh/packages/core/src/event.ts)

看什么：
- `AgentEvent` 判别联合的字段含义
- `text_delta` / `tool_call_delta` / `done` 的生命周期
- 错误如何以事件形式传播

---

## 之后去哪

| 你的目标 | 下一步 |
|---|---|
| 加新工具 | 读 [`docs/divergence-log.md`](divergence-log.md) "tools 散落" 一节 |
| 加新模型 | 看 `packages/llm/llm-pi-ai` 的 adapter，对照写新 provider |
| 改上下文压缩 | 读 DSH `packages/compaction/src/strategy.ts` |
| 改会话持久化 | 读 DSH `packages/session/src/store.ts` |
| 加 sub-agent | 读 DSH `packages/subagent/`（未镜像） |
| 加 MCP | 读 DSH `packages/mcp/`（未镜像） |