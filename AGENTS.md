# AGENTS.md

> 给 AI 与人类读者看的"代码地图"。三条信息：
>
> 1. 每个镜像包是干什么的（3 句话以内）
> 2. 每个镜像包对应 DSH 的哪个包
> 3. 每个常见修改该往哪个包放

## 包 ↔ DSH 对照表

| 镜像包 | DSH 对应 | 一句话 | 类型完整 | 实现完整 |
|---|---|---|---|---|
| `packages/core` | `packages/core` | 协议无关的领域类型（消息/事件/工具/错误） | ✅ | ✅（仅类型） |
| `packages/llm` | `packages/llm/llm` | LLM 客户端接口与通用类型 | ✅ | ⚠️ 接口 + 简化 retry |
| `packages/llm-retry` | `packages/llm/llm-retry` | 重试策略接口 | ✅ | ❌ 仅接口 |
| `packages/llm-deepseek` | `packages/llm/llm-deepseek` | DeepSeek provider 适配 | ✅ | ❌ 仅 wire 类型 + 占位 |
| `packages/tools` | 散落（`core/tools`+`shell`+`fs`） | 工具协议 + 内置工具骨架 | ✅ | ❌ 仅接口 |
| `packages/context` | `packages/context` + `packages/compaction` | 消息存储 + 压缩接口 | ✅ | ❌ 仅接口 |
| `packages/session` | `packages/session` | 会话持久化接口 | ✅ | ❌ 仅接口 |
| `packages/config` | `packages/settings` + `packages/preset` | 配置加载接口 | ✅ | ❌ 仅接口 |
| `packages/agent` | `packages/code-runtime` | Agent 主循环 | ✅ | ❌ 仅接口 |
| `apps/cli` | `apps/cli` | CLI 进程入口与命令树 | ✅ | ⚠️ main + 3 命令占位 |
| `examples/minimal` | — | "hello agent" 示例 | — | ⚠️ 占位 |

## 依赖图（必须保持单向）

```
apps/cli ──► agent ──► core ◄── llm ◄── llm-deepseek
                  │
                  ├──► tools
                  ├──► context
                  ├──► session
                  └──► config
agent ◄── llm-retry ◄── llm
```

## 常见修改该往哪放

| 想做的事 | 改哪里 | 镜像提示 |
|---|---|---|
| 加一个新模型（OpenAI / Anthropic / 本地） | 新建 `packages/llm-<name>/`，实现 `LLMClient` | 参考 `packages/llm-deepseek/` |
| 改 LLM 客户端接口 | `packages/llm/src/client.ts` | ⚠️ 同步改 DSH |
| 加一个内置工具 | `packages/tools/src/builtin/<name>.ts` | 镜像 6 个示例：`read_file` / `write_file` / `edit_file` / `run_command` / `grep` / `list_dir` |
| 改 agent 循环 | `packages/agent/src/agent.ts` | ⚠️ 必须对照 DSH `packages/code-runtime/src/runtime.ts` |
| 改上下文压缩策略 | `packages/context/src/compaction.ts` | DSH 同位置有完整实现 |
| 加 CLI 命令 | `apps/cli/src/commands/<name>.ts` + 在 `main.ts` 注册 | DSH `apps/cli/src/commands/` 有 ~20 个 |
| 改事件类型 | `packages/core/src/events.ts` | ⚠️ 这是全仓库最容易被破坏的改动 |

## DSH 阅读顺序

详见 [`docs/reading-order.md`](docs/reading-order.md)。简版：

1. `apps/cli/src/main.ts`
2. `packages/code-runtime/src/runtime.ts`
3. `packages/llm/llm/src/client.ts`
4. `packages/llm/llm-deepseek/src/adapter.ts`
5. `packages/core/src/event.ts`

## 镜像内的导航约定

- 每个 `src/index.ts` 第一行：`/** @mirror DSH: <dsh-path> */`
- 每个函数体为 `throw new Error('TODO: see lessons/0X')` 时，`0X` 是对应教学章节
- 任何"为教学特意简化"的实现，必须在 `docs/divergence-log.md` 登记

## 当前未镜像的 DSH 关键包

按"教学价值"排序（高 → 低）：

| DSH 包 | 教学价值 | 何时镜像 |
|---|---|---|
| `packages/llm/llm-pi-ai` | 中（看 DSH 如何对接 pi-mono） | 加新 provider 时 |
| `packages/compaction` | 高（上下文管理是核心概念） | lesson 05 |
| `packages/tools` *（同名包）* | 中（看 DSH 内部如何用 zod） | lesson 07 |
| `packages/subagent` | 中（多 agent 编排入门） | 未来 lesson |
| `packages/mcp` | 低（协议细节多） | 视需求 |
| `packages/workflow` | 中（多 agent 进阶） | 未来 lesson |

## 验证镜像忠实度

本仓库不强制自动化校验 `@mirror` 注释指向真实 DSH 路径。若 DSH 文件被移动/重命名，镜像侧注释可能过时 —— 修复时优先改注释再改代码。