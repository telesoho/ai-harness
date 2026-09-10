/**
 * @mirror DSH: packages/fs/src/write.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface WriteFileArgs {
  path: string;
  content: string;
}

export const writeFileTool: Tool = {
  name: 'write_file',
  description: '写入文件（覆盖）。目录不存在会自动创建。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['path', 'content'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    void (args as WriteFileArgs);
    throw new Error('TODO: see lessons/07');
  },
};