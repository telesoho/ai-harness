# AI Harness — A Readable Mirror of DeepSeek Harness

> 学习目标：**读懂并能修改** [DeepSeek Harness](https://example.com/dsh)（仓库位于 `C:\Users\telesoho\prjs\3part\deepseek-harness`，下文简称 **DSH**）。

DSH 是一个 50+ 包、几十万行的生产级 agent 运行时，直接读很容易劝退。本仓库是它的**可跑简化镜像**：剥到 10 个包、保留类型与接口骨架，每一行都标注"在 DSH 里对应哪里"。读者顺着本镜像读完后，能无缝跳到 DSH 源码做实际修改。

## 这个仓库不是什么

- ❌ 不是要从零重写一个 harness（已有 DSH）。
- ❌ 不是生产可用的 agent（大量 `TODO`，详见 [`docs/divergence-log.md`](docs/divergence-log.md)）。
- ❌ 不是 DSH 的替代品。

## 这个仓库是什么

- ✅ DSH 拓扑的 1:10 缩影。
- ✅ 类型层完整的可跑代码 —— `pnpm -r build` 通过，`aih --help` 可执行。
- ✅ 每行带 `// → DSH: path/to/file.ts` 注释的源码。
- ✅ 一份"为什么这样组织"的导读文档（[`docs/`](docs/)）。

## 快速开始

```bash
pnpm install
pnpm -r typecheck
pnpm -r build
node apps/cli/dist/main.js --help
```

## 推荐阅读顺序

1. [`docs/why-mirror.md`](docs/why-mirror.md) — 为什么要做镜像
2. [`docs/dsh-tour.md`](docs/dsh-tour.md) — DSH 仓库 30 分钟导览
3. [`docs/reading-order.md`](docs/reading-order.md) — 5 步读懂 DSH 核心
4. [`AGENTS.md`](AGENTS.md) — 包 ↔ DSH 对照表
5. [`lessons/`](lessons/) — 渐进式教程（可选）

## 目录速览

```
ai-harness/
├─ docs/           # 导读：DSH 是什么、为什么、怎么读
├─ lessons/        # 渐进式教程（4 章占位）
├─ packages/       # 镜像区：10 个包，类型完整，实现多为 TODO
├─ apps/cli/       # CLI 入口：`aih` 命令
└─ examples/       # 可跑的最小示例
```

## 许可证

本仓库为教学用途，代码均为手工重写，不直接复制 DSH 源码。