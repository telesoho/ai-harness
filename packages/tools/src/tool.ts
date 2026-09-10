/**
 * @mirror DSH: packages/core/src/tools/tool.ts（合并了 tools 协议）
 *
 * 在 DSH 中，"工具"概念散落在多处：
 * - `packages/core/src/tools/tool.ts` —— 协议定义
 * - `packages/shell` —— shell 命令
 * - `packages/fs` —— 文件系统
 * - `packages/llm/llm-pi-ai/src/auth.ts` —— 认证
 *
 * 本镜像统一到 `packages/tools/` 一个包内。
 */

import type { ToolContext, ToolDefinition, ToolResult } from '@ai-harness/core';

export type { ToolContext, ToolDefinition, ToolResult };

/** 一个完整的 tool 实现。DSH 通过 zod schema 推导 `parameters` 类型；本镜像用 `unknown`。 */
export interface Tool extends ToolDefinition {
  execute(args: unknown, ctx: ToolContext): Promise<ToolResult>;
}