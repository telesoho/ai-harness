# 镜像 vs DSH：差异清单

> 本文档记录本镜像与 DSH 的所有有意差异。每条差异必须解释**为什么**与**何时该回到 DSH**。

## 1. 包数量：镜像 10 个 vs DSH ~50 个

- **为什么**：DSH 50+ 包对学习者是噪声；本镜像按"概念簇"合并。
- **回到 DSH**：当 DSH 里有你需要的、镜像没暴露的包，直接读原版。

## 2. `parameters: unknown` 占位

- **镜像**：`packages/tools/src/tool.ts` 用 `readonly parameters: unknown`
- **DSH**：用 zod schema，提供类型推导与运行时校验
- **为什么**：zod 是运行时依赖；本仓库刻意保持"无运行时三方依赖"，方便读者一眼看清类型。
- **回到 DSH**：读 `packages/core/src/tools/tool.ts` 看 zod 的真实用法。

## 3. retry 简化

- **镜像**：`packages/llm-retry` 仅暴露接口与 backoff 常量
- **DSH**：完整 retry policy 包含错误分类、指数退避、最大重试次数、抖动
- **为什么**：retry 是工程细节，对概念学习帮助小。
- **回到 DSH**：读 `packages/llm/llm-retry/src/policy.ts`。

## 4. 不实现的包（~40 个）

DSH 的以下包在镜像中**完全不存在**，仅在 `docs/dsh-tour.md` 标注：

- `acp` / `api` / `sdk` —— 协议层
- `mcp` / `lsp` —— 外部协议
- `subagent` / `workflow` —— 多 agent
- `desktop` / `desktop-host` / `web` / `interaction` / `host` —— UI 层
- `e2b` / `sandbox` —— 沙箱
- `webhook` / `schedule` —— 异步
- `goal` / `skill` / `guard` / `hooks` / `plan` / `todo` / `feedback` —— 行为框架
- `credentials` / `attachment` / `bundle` / `boot` / `client` / `jobs` / `runtime-diagnostics` / `spill` / `subprocess` / `typert` / `test-support` / `util` / `experimental` / `extensions` —— 基础设施
- `deepseek-llm-api-extensions` —— DeepSeek 特殊能力（files API 等）
- `llm-pi-ai` —— pi-mono 适配层

## 5. tools 概念合并

- **DSH**：`tools` 概念散落在 `packages/tools/`（不存在同名包）、`packages/shell/`、`packages/fs/`、`packages/core/src/tools/`
- **镜像**：统一在 `packages/tools/` 暴露
- **回到 DSH**：搜索 `tool.ts` 在 DSH 中的多处出现。

## 6. agent 循环的"假实现"

- **镜像**：`packages/agent/src/agent.ts` 的 `runAgent` 函数体是 `throw new Error('TODO: see lessons/03')`
- **DSH**：`packages/code-runtime/src/runtime.ts` 是完整实现
- **为什么**：agent 循环是教学核心，下一步才实现。
- **回到 DSH**：必须读 DSH 完整版才能理解真实复杂度（hook、权限、并发、超时）。

## 7. CLI 命令简化

- **镜像**：`aih run` / `aih repl` / `aih init` 三个占位命令
- **DSH**：`dsh` / `claude` ~20 个命令，含 `--resume` / `--fork` / `--print` 等
- **回到 DSH**：读 `apps/cli/src/commands/` 下的完整命令树。

## 8. Session 存储未实现

- **镜像**：`SessionStore` 是接口，实现抛 TODO
- **DSH**：JSONL + WAL + 索引，详见 `packages/session/src/store.ts`
- **回到 DSH**：理解 DSH 为何用 JSONL（追加写、便于流式回放）。

## 9. context / compaction 合并

- **DSH**：`packages/context` 与 `packages/compaction` 分开
- **镜像**：合并到 `packages/context`，compaction 仅占位接口

## 10. 无实际 LLM HTTP 调用

- **镜像**：`DeepSeekClient.complete()` 函数体 throw
- **DSH**：真实 `fetch()` + SSE 解析
- **为什么**：HTTP 调试是工程而非概念；先理解接口形状再去看 wire 解析。

## 11. 类型命名一致性

镜像类型名尽量与 DSH 一致（如 `GenerateOptions`、`LLMEvent`），但**不保证 1:1**。若你在 DSH 找不到镜像里出现的名字，可能是合并或重命名。

## 12. ESM vs CJS

- **镜像**：`"type": "module"`，ESM only
- **DSH**：混合，部分 CJS
- **为什么**：教学项目优先选择现代方向。