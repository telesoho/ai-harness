/**
 * @mirror DSH: packages/core/src/tools/registry.ts
 */

import type { ToolDefinition, ToolResult, ToolContext } from '@ai-harness/core';
import type { Tool } from './tool.js';

export interface ToolRegistry {
  register(tool: Tool): void;
  get(name: string): Tool | undefined;
  list(): ToolDefinition[];
  /**
   * 调用一个工具。DSH 在 `invoke` 内部会做：
   * - permission 检查（`guard` 包）
   * - 参数校验（zod）
   * - 超时控制
   * - 结果格式化
   * 本镜像只暴露签名。
   */
  invoke(name: string, args: unknown, ctx: ToolContext): Promise<ToolResult>;
}

export class InMemoryToolRegistry implements ToolRegistry {
  private readonly tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return [...this.tools.values()].map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    }));
  }

  async invoke(name: string, args: unknown, ctx: ToolContext): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { content: `tool not found: ${name}`, isError: true };
    }
    return tool.execute(args, ctx);
  }
}