/**
 * @mirror DSH: packages/fs/src/edit.ts
 */

import type { Tool, ToolContext } from '../tool.js';

export interface EditFileArgs {
  path: string;
  /** 唯一匹配字符串。DSH 强制要求 old_text 在文件中恰好出现一次。 */
  old_text: string;
  new_text: string;
}

export const editFileTool: Tool = {
  name: 'edit_file',
  description:
    '精确替换文件中的字符串。old_text 必须在文件中恰好出现一次；否则返回错误。',
  parameters: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      old_text: { type: 'string' },
      new_text: { type: 'string' },
    },
    required: ['path', 'old_text', 'new_text'],
    additionalProperties: false,
  },
  async execute(args: unknown, _ctx: ToolContext) {
    void _ctx;
    void (args as EditFileArgs);
    throw new Error('TODO: see lessons/07');
  },
};