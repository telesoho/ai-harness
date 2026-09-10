/**
 * @mirror DSH: packages/fs/src/grep.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface GrepArgs {
  pattern: string;
  path?: string;
  /** 正则语法；DSH 默认 rust regex。 */
  regex?: boolean;
  /** 上下文行数。 */
  context?: number;
}

export const grepTool: Tool = {
  name: 'grep',
  description:
    '在 path 下递归搜索 pattern；返回匹配行 + 上下文。默认 ripgrep 兼容。',
  parameters: {
    type: 'object',
    properties: {
      pattern: { type: 'string' },
      path: { type: 'string' },
      regex: { type: 'boolean', default: true },
      context: { type: 'number', minimum: 0, maximum: 50 },
    },
    required: ['pattern'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    void (args as GrepArgs);
    throw new Error('TODO: see lessons/07');
  },
};