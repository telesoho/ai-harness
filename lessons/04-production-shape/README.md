# Lesson 04 — production-shape

> **目标**：回头看 lessons/01–03 的代码，解释"为什么 DSH 最终长成 50+ 包"。

## 本章不写新代码

只读 [`docs/dsh-tour.md`](../../docs/dsh-tour.md) 和 [`AGENTS.md`](../../AGENTS.md)。

## 关键问题

1. **为什么 `core` 单独成包？** —— 它的判别联合（`AgentEvent`）被 30+ 包 import；放任何包里都会产生循环依赖。
2. **为什么 `llm-deepseek` 与 `llm` 拆开？** —— `llm` 是 provider 中立的接口；DSH 有 ~5 个 provider 实现（DeepSeek / OpenAI / Anthropic / pi-ai / 自定义）。拆开后，provider 可以独立迭代不影响调用方。
3. **为什么 `tools` 不只一个包？** —— 工具实现依赖 shell / fs / 网络 / auth 等基础能力；DSH 把它们各自拆包，`tools` 是协议层。
4. **为什么 `agent` 与 `cli` 拆开？** —— `agent` 是协议无关的循环；`cli` 是给人类用的进程入口。Web / Desktop 复用同一个 `agent`。
5. **为什么 `context` 与 `compaction` 拆开？** —— 消息存储可以纯内存；压缩策略需要选型（截断 / 摘要 / 滑动窗口）。拆开让策略可替换。

## 本章涉及的 DSH 源

- [`packages/core/AGENTS.md`](https://example.com/dsh/packages/core/AGENTS.md) —— 每个包都有自己的 AGENTS.md，解释它为什么存在
- [`docs/CONTRIBUTING.md`](https://example.com/dsh/docs/CONTRIBUTING.md) —— DSH 仓库的"如何添加新包"

## 章末检查

读完本章你应该能：

- [ ] 给一个常见修改（"加新模型 / 新工具 / 新 CLI 命令"）指路到正确包
- [ ] 解释为什么 DSH 不把所有代码塞进 `apps/cli`
- [ ] 跳到 DSH 任意一个新包，能看懂它的入口与依赖方向

之后若想再深入：

- lesson 05（**未在本仓库**）—— 上下文压缩策略
- lesson 06（**未在本仓库**）—— 会话持久化
- lesson 07（**未在本仓库**）—— 内置工具真实实现
- lesson 08（**未在本仓库**）—— sub-agent / workflow 入门