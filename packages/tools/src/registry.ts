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
   * Run a registered tool. DSH also does permission, zod validation, and
   * timeouts; this mirror looks up `name` and calls `execute`.
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
    try {
      return await tool.execute(args, ctx);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { content: message, isError: true };
    }
  }
}