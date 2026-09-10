# DSH 30 分钟导览

> 本文档是 DeepSeek Harness（DSH）仓库的鸟瞰图。读完后你应该能：
>
> 1. 知道 DSH 有哪些"族"
> 2. 知道每一族大致做什么
> 3. 知道新手先看哪几个包

DSH 仓库位于 `C:\Users\telesoho\prjs\3part\deepseek-harness`。

## 顶层结构

```
deepseek-harness/
├─ apps/                # 4 个用户可见入口
│  ├─ cli/              # 命令行：`dsh` / `claude`
│  ├─ desktop/          # 桌面 GUI（Tauri）
│  ├─ desktop-host/     # 桌面后端（Electron）
│  └─ web/              # Web UI（Vite + React）
├─ packages/            # ~50 个核心包
├─ benchmarks/          # 评测脚本
├─ python/              # Python 绑定
├─ native/              # Rust 原生模块
├─ docs/                # 文档站
└─ vendor/              # 第三方源码（部分 patch）
```

## packages 的"族"

DSH 没有显式的"族"目录，但包名有清晰模式。下面按**学习优先级**分组。

### 族 1：核心抽象（先看）

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/core` | 判别联合、错误基类、协议无关类型 | `packages/core` |
| `packages/llm/llm` | LLM 客户端接口 | `packages/llm` |
| `packages/llm/llm-deepseek` | DeepSeek provider | `packages/llm-deepseek` |
| `packages/llm/llm-pi-ai` | pi-mono AI 适配层 | （未镜像，标注"DSH 用了第三方适配"） |
| `packages/llm/llm-retry` | 重试策略 | `packages/llm-retry` |
| `packages/llm/deepseek-llm-api-extensions` | DeepSeek 特殊能力（files/thinking） | （未镜像，标 TODO） |

### 族 2：能力层

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/code-runtime` | Agent 主循环 | `packages/agent` |
| `packages/context` | 消息/压缩 | `packages/context` |
| `packages/compaction` | 上下文压缩策略 | （合入 `packages/context`） |
| `packages/session` | 会话持久化 | `packages/session` |
| `packages/storage` | 底层存储 | （未镜像，session 直接用 fs） |
| `packages/settings` | 配置中心 | `packages/config` |
| `packages/preset` | 配置预设 | （合入 `packages/config`） |

### 族 3：工具与扩展

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/tools` *（概念散落）* | 工具协议 | `packages/tools` |
| `packages/shell` | Shell 命令执行 | `packages/tools/builtin/run_command` |
| `packages/fs` | 文件系统操作 | `packages/tools/builtin/read_file` 等 |
| `packages/terminal` | 终端 UI | （未镜像） |
| `packages/mcp` | MCP 协议 | （未镜像） |
| `packages/lsp` | LSP 协议 | （未镜像） |

### 族 4：UI 与交互

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/interaction` | 交互事件抽象 | （未镜像） |
| `packages/host` | 平台宿主抽象 | （未镜像） |
| `packages/web` | Web 通用组件 | （未镜像） |
| `packages/cli` *（注意：与 apps/cli 不同）* | CLI 工具库 | `apps/cli` 间接 |

### 族 5：协议与外部

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/acp` | Agent Communication Protocol | （未镜像） |
| `packages/api` | HTTP API | （未镜像） |
| `packages/sdk` | SDK 入口 | （未镜像） |

### 族 6：基础设施

| 包 | 一句话 | 镜像对应 |
|---|---|---|
| `packages/util` | 通用工具 | （未镜像，按需引用） |
| `packages/credentials` | 凭据管理 | （未镜像） |
| `packages/sandbox` | 沙箱 | （未镜像） |
| `packages/e2b` | E2B 云沙箱 | （未镜像） |
| `packages/webhook` | Webhook | （未镜像） |
| `packages/subagent` | 子 agent | （未镜像） |
| `packages/workflow` | 多 agent 编排 | （未镜像） |
| `packages/schedule` | 调度 | （未镜像） |
| `packages/goal` | 目标追踪 | （未镜像） |
| `packages/skill` | Skill 注册 | （未镜像） |
| `packages/guard` | 安全检查 | （未镜像） |
| `packages/hooks` | 生命周期钩子 | （未镜像） |
| `packages/plan` | 计划模式 | （未镜像） |
| `packages/todo` | Todo 列表 | （未镜像） |
| `packages/feedback` | 反馈收集 | （未镜像） |
| `packages/runtime-diagnostics` | 运行时诊断 | （未镜像） |
| `packages/spill` | 长输出分流 | （未镜像） |
| `packages/attachment` | 附件处理 | （未镜像） |
| `packages/bundle` | 打包工具 | （未镜像） |
| `packages/boot` | 启动流程 | （未镜像） |
| `packages/client` | 客户端协议 | （未镜像） |
| `packages/jobs` | 后台任务 | （未镜像） |
| `packages/session-query` | 会话查询 | （未镜像） |
| `packages/extensions` | 扩展点 | （未镜像） |
| `packages/experimental` | 实验性 | （未镜像） |
| `packages/typert` | 类型工具 | （未镜像） |
| `packages/test-support` | 测试辅助 | （未镜像） |
| `packages/subprocess` | 子进程 | （未镜像） |

## 30 分钟路线图

1. **5 分钟**：打开 `apps/cli/src/main.ts`，跟着调用跳到 `boot.ts`。
2. **10 分钟**：打开 `packages/code-runtime/src/runtime.ts`，看 agent 主循环。
3. **10 分钟**：打开 `packages/llm/llm/src/client.ts` 和 `packages/llm/llm-deepseek/src/adapter.ts`，看 LLM 抽象与适配。
4. **5 分钟**：打开 `packages/core/src/event.ts`，看事件如何流。

详细步骤见 [`reading-order.md`](reading-order.md)。