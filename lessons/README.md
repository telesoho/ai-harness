# Lessons — 渐进式教程

> 这一目录是"边学边做"的章节。每章独立可跑，章末有一个"镜像对应表"告诉你刚才写的代码在 packages/ 里长什么样。

## 章节列表

| # | 标题 | 主题 | 镜像章节末态 |
|---|---|---|---|
| 01 | [hello-agent](./01-hello-agent/) | 一个能 `aih "你好"` 的最小循环 | `packages/llm-deepseek/src/adapter.ts` 解锁 |
| 02 | [streaming](./02-streaming/) | 流式事件如何从 wire 到 AgentEvent | `packages/llm-deepseek/src/translate.ts` 解锁 |
| 03 | [tools-and-loop](./03-tools-and-loop/) | 工具调用 + while 循环 | `packages/agent/src/agent.ts` 解锁 |
| 04 | [production-shape](./04-production-shape/) | 为什么 lessons 里的代码要拆成 10 个包 | `AGENTS.md` 复习 |

## 学习原则

1. **先跑通，再读实现**：每章从 `pnpm run` 一个能工作的命令开始。
2. **遇到 `TODO(lessons/0X)` 时跳到对应章节**：不要硬读 `packages/` 里的占位代码。
3. **学完一章回头对照 `packages/`**：镜像代码就是该章内容的"生产版形态"。

## 推荐先读

[`docs/why-mirror.md`](../docs/why-mirror.md) → [`docs/reading-order.md`](../docs/reading-order.md) → [chapter 01](./01-hello-agent/)。