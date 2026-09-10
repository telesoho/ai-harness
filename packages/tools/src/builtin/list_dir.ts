/**
 * @mirror DSH: packages/fs/src/list.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface ListDirArgs {
  path: string;
  /** 是否递归列出子目录。 */
  recursive?: boolean;
}

export const listDirTool: Tool = {
  name: 'list_dir',
  description: '列出目录内容。recursive=true 时递归列出所有子目录。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      recursive: { type: 'boolean', default: false },
    },
    required: ['path'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    void (args as ListDirArgs);
    throw new Error('TODO: see lessons/07');
  },
};